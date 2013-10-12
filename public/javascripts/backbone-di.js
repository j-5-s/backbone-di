(function(){

  var slice = [].slice;

  /**
   * DataStorage middleware or backbone with RequireJS
   * @class DataStore
   * @requires requirejs
   * @classdesc A module that keeps track of data. Goal is to create a singleton
   * that looks at localStorage or app variables for instantiated data
   * and returns them or instantiates a new one if none exists
   *
   */
  var DataStore = function() {
    this.events = _.extend({},Backbone.Events);
    this.isReady = false;
    this.cache = {};
    this.useLocalStorage = false;
  };


  /**
   * Gets entities (collections or models)
   * @param {Array} [entities] - requirejs file paths to grab
   * @returns {Deferred} - jQuery Deferred object loading is complete
   * @description a ready event will get trigger when each model has been loaded
   * in the following naming convention ready:<file/path>
   * <file/path> being the value passed into the first parameter.
   * loading is complete.
   */
   //use entities rather than collections
   //.lookup rather than get
   //use urlRool for storage key
   //
  DataStore.prototype.lookup = function( entities, options ) {
    var self = this,
        dfd = $.Deferred(),
        originalEntities = _.clone( entities ),
        idMap = {};

      options = options || {};
      if (typeof options.reset === 'undefined') {
        options.reset = false;
      }
      //only add the collections that don't exist
      //so remove the ones that do
      
      /**
       * Determines if the object is a backbone object
       * really poorly done right now. @todo, refactor
       * @param {Object} - obj
       * @returns {Boolean}
       */
      var isBackboneObject = function( obj ) {

        //this method should only be called on objects
        if (typeof obj === 'string' ) {
          throw new Error('strings are not backbone objects');
        }

        if ( _.toArray(obj).length > 1 ) {
          return true;
        }

        return false;
      };

      /**
       * Removes Backbone objects from the `entities`
       * array passed into `lookup`. As well as removing
       * the object, it stores it on `this.cache` using
       * either the `dataStoreKey` or a random key
       *
       * @todo refactor keys to use something more dynamic
       * @param {Mixed} name - string or object to store
       *   if its a string it ignores it.
       * @param {Integer} i - the current index of the loop
       */
      var removeBackboneObjectFromEntity = function( name, i ) {
        if ( typeof name === 'object' ) {
          if ( isBackboneObject( name ) ) {
            var id;
            //if the dataStoreKey is set, use it. otherwise
            //create a random key for the cache id
            if ( typeof name.dataStoreKey !== 'undefined' ) {
              id = (name.id) ? ':'+name.id : '';
              name.dataStoreKey = name.dataStoreKey+id;
              self.cache[name.dataStoreKey] = name;
            } else {
              id = _.uniqueId('dataStore_');
              name.dataStoreKey = id;
              self.cache[id]  = name;
            }
            entities.splice(i,1);
          }
        }
      };

      /**
       * This cb function will take the entity passed
       * into `lookup` and transform the strings in
       * the entities array to their requirejs paths
       * the lookup function is dynamic and can take
       *  * The requirejs string
       *  * An object like `{'models/OneModel':1}` - 1 being the id
       *  * A backbone model or collection
       * @param {Mixed} name - string or object to normalize
       * @param {Integer} i - the current index of the loop
       */
      var normalizeEntityToRequireJSPath = function( name, i ) {
        if ( typeof name === 'object' ) {

          //name is an object
          //either a {kev:value} with require path
          //and id such as {'models/ModelName': 1}
          //or its an actual backbone object
          if ( !isBackboneObject(name) ) {
            var key = _.keys(name)[0];
            idMap[key] = name[key];
            name = key;
            entities[i] = name;
          }
        }
      };


      _.each( entities, removeBackboneObjectFromEntity );
      _.each( entities, normalizeEntityToRequireJSPath );

      //instantiate the new models
      require(entities, function(){
        var args = slice.call(arguments);
        var dfds = [];

        _.each( args, function(Arg, i){

          //check again for cache
          //because of async nature of requirejs,
          //model/collection could now be in cache
          if (typeof self.cache[entities[i]] !== 'undefined') {
            if ( typeof idMap[entities[i]] === 'undefined') {
              return;
            }
          }
          //explain

          var mDfd = $.Deferred();
          var params;
          if (typeof idMap[entities[i]] !== 'undefined') {
            params = {};
            var id = idMap[entities[i]];
            params.id = id;
            entities[i] += ':' + id;
          }

          //check for data in localStorage to populate with
          var data = self.getFromLocalStorage( entities[i] );

          if (data) {
            params = data;
          }

          self.cache[entities[i]] = new Arg(params);
          self.cache[entities[i]].dataStoreKey = entities[i];
          //name entity
          //need a flag to unbind
          self.cache[entities[i]].on('sync', function(model) {
            //look to see if it gets called by fetch
            self.saveToLocalStorage( model );
          });

          //fetch the data from the database
          (function( obj, name, data ){
            //
            if (data && !options.reset) {
              self.events.trigger('ready:'+ name, obj);
              mDfd.resolve();
            } else {
              //may want to fetch and reset collection
              //think about design on how to do that
              //and other fetch options
              obj.fetch().done(function(){
                self.events.trigger('ready:'+ name, obj);
                mDfd.resolve();
              });
            }

          }(self.cache[entities[i]],entities[i],data));

          dfds.push(mDfd);
        });

        $.when.apply($, dfds).done(function(){
          var args = _.map(originalEntities, function(entity){
              if (typeof entity === 'object') {
                  if (typeof entity.dataStoreKey !== 'undefined' ) {
                    return self.cache[ entity.dataStoreKey ];
                  } else {
                    var key = _.keys( entity )[0] + ':' +_.toArray( entity )[0];
                    return self.cache[ key ];
                  }
              }
              return self.cache[entity];
          });
          //delete originalCollections;
          dfd.resolve.apply( null, args );
          self.events.trigger('ready');
          //entity could have been fetch from the server
          self.saveToLocalStorage();
        }).fail(function( m ){
          throw new Error('Failed call');
        });
      });

    return dfd.promise();

  };

  /**
   * Simple method to get the model/collection from the datastore
   * the method must first have been registered (see @register)
   * @returns {Mixed} [model or collection]
   * @throws {Error} - if no model/collection is saved in the cache
   */
  DataStore.prototype.getFromCache = function( filepath ) {
    if (typeof this.cache[filepath] !== 'undefined') {
       return this.cache[filepath];
    }
    throw new Error ( filepath + " is not defined." );
  };

  /**
   * Saves the models and collections in the `cache` property
   * to localStorage
   */
  DataStore.prototype.saveToLocalStorage = function( obj ) {

    if ( !this.useLocalStorage ) {
      return;
    }

    if (typeof obj === 'undefined') {
      try {
        _.each(this.cache, function(modelOrCollection, key){
          var strData = JSON.stringify(modelOrCollection.toJSON());
          window.localStorage.setItem(key, strData);
        });
      } catch(e) {
        //local storage is probably not supported
      }
    } else {
      try {
        var strData = JSON.stringify(obj.toJSON());
        window.localStorage.setItem(obj.dataStoreKey, strData);
      } catch(e) {
        //local storage is probably not supported
      }
    }
  };

  //do localStorage per
  //flag individual models/collections
  DataStore.prototype.getFromLocalStorage = function( key ) {

    if ( !this.useLocalStorage ) {
      return {};
    }

    if (typeof key === 'undefined') {
      throw new Error('Key not provided to get from localStorage');
    }
    var data;
    try {
      data = JSON.parse(window.localStorage.getItem(key));
    } catch(e) {
      //localStorage likely not supported
    }
    return data;
  };

  DataStore.prototype.removeFromLocalStorage = function( key ) {
    try {
      delete window.localStorage[key];
    } catch(e) {
      //silence
    }
  };


  //Backbone.$
  //for deferred
  //look at local storage
  //marionette page 219 (gentle introduction)
  //app.dataStore - mixin

  define(['jquery',
          'backbone',
          'underscore'
          ], function( $, Backbone, _ ) {

    var dataStore;
    //dataStore is a singleton
    if ( typeof window._dataStore === 'undefined') {
      dataStore = new DataStore();
      window._dataStore = dataStore;
    } else {
      dataStore = window._dataStore;
    }



    dataStore.events.on('ready', function(){
      dataStore.isReady = true;
    });

    return dataStore;

  });

}());