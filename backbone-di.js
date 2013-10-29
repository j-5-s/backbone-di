//
//  Backbone-di.js 0.0.5
//
//  (c) 2013 James Charlesworth
//  Backbone-di may be freely distributed under the MIT license.
//  For all details and documentation:
//  https://github.com/jamescharlesworth/backbone-di/
//

(function( root, factory, undef ){
  'use strict';
  if (typeof exports === 'object') {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like enviroments that support module.exports,
      // like Node.
      module.exports = factory(require('underscore'), require('Backbone'));
  } else if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['underscore', 'backbone'], function (_, Backbone) {
          // Check if we use the AMD branch of Back
          _ = _ === undef ? root._ : _;
          Backbone = Backbone === undef ? root.Backbone : Backbone;
          return (root.returnExportsGlobal = factory(_, Backbone, root));
      });
  } else {
      // Browser globals
      root.returnExportsGlobal = factory(root._, root.Backbone);
  }
}(this, function (_, Backbone, root, undef) {


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
   //use `urlRool` for storage key
  DataStore.prototype.lookup = function( entities, options ) {
    var self = this,
        dfd = $.Deferred(),
        originalEntities = _.clone( entities ),
        idMap = {};

      options = options || {};
      if ( options.reset === undef ) {
        options.reset = false;
      }


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
       * Checks to see if an object is a collection
       * by looking for models attribute
       * @param {Object} obj
       * @returns {Boolean}
       */
      var isCollection = function( obj ) {
        if ( typeof obj.models !== 'undefined' ) {
          return true;
        }
        return false;
      };

      /**
       * Checks if the object is a Backbone Model
       * by looking for attributes property array
       */
      var isModel = function( obj ) {
        if ( obj.attributes !== undef) {
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

              if ( name.urlRoot ) {
                name.dataStoreKey = _.result( name, 'urlRoot' );
              } else if ( name.url ) {
                name.dataStoreKey = _.result( name, 'url' );
              } else if (name.collection && name.collection.url ) {
                name.dataStoreKey = _.result( name.collection, 'url' );
              } else {
                throw new Error('A url or urlRoot must be specified on the model/collection');
              }
              
              self.cache[name.dataStoreKey] = name;
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

          if ( self.cache[entities[i]] !== undef) {
            if ( idMap[entities[i]] === undef ) {
              return;
            }
          }


          var entityDfd = $.Deferred();
          var params;
          if ( idMap[entities[i]] !== undef ) {
            params = {};
            var id = idMap[entities[i]];
            params.id = id;
            entities[i] += ':' + id;
          }

          //check for data in localStorage to populate with
          var data = self.getFromLocalStorage( entities[i] );

          if ( _.toArray(data).length ) {
            params = data;
          }

          var changedAttributes = true;
          if (self.cache[entities[i]] && _.toArray(data)) {
            changedAttributes = false;
          }

          //if the entity already exists, use it, otherwise create a new instance
          self.cache[entities[i]] = self.cache[entities[i]] || new Arg(params);
          var entity = self.cache[entities[i]];
          entity.dataStoreKey = entities[i];

          
          entity.dataStoreCachable = true;



          //need a flag to unbind
          if ( isCollection( self.cache[entities[i]] ) ) {
            self.cache[entities[i]].each(function(m){
              m.on('sync', function(model) {
                //look to see if it gets called by fetch
                self.saveToLocalStorage( model );
              });
            });

            self.cache[entities[i]].on('add', function( model ){
              self.saveToLocalStorage( model.collection );
            });
            self.cache[entities[i]].on('remove', function( model ){
              self.saveToLocalStorage( model.collection );
            });
          } else if ( isModel( self.cache[entities[i]] ) ) {
            self.saveToLocalStorage( self.cache[entities[i]] );
          }


          //fetch the data from the database
          //needs to be wrapped in function because
          //object, name, and data are used after fetch
          //is called.
          (function( obj, name, data, changedAttributes ){
            //
            if (_.toArray(data).length && !options.reset || !changedAttributes) {
              self.events.trigger('ready:'+ name, obj);
              entityDfd.resolve();
            } else {
              //may want to fetch and reset collection
              //think about design on how to do that
              //and other fetch options
              obj.fetch().done(function(){
                self.events.trigger('ready:'+ name, obj);
                entityDfd.resolve();
              });
            }

          }(self.cache[entities[i]],entities[i],data, changedAttributes));

          dfds.push(entityDfd);
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
          //self.saveToLocalStorage();
        }).fail(function( m ){
          throw new Error('Failed call');
        });
      });

    return dfd.promise();
  };


  /**
   * Disables the cache for a given entity
   * @param {Mixed} entity - model or collection
   * accepts `all` to disable all or the model/collection
   */
  DataStore.prototype.disableCache = function( entity ) {
    var self = this;
    if ( entity === 'all' ){
      _.each(this.cache, function(entity){
        entity.dataStoreCachable = false;
        self.removeFromLocalStorage( entity.dataStoreKey );
      });
    } else {
      entity.dataStoreCachable = false;
      this.removeFromLocalStorage( entity.dataStoreKey );
    }
    
  };

  /**
   * Enables the cache for a given entity
   * @param {Mixed} entity - model or collection
   * accepts `all` to disable all or the model/collection
   */
  DataStore.prototype.enableCache = function( entity ) {
    if ( entity === 'all' ){
      _.each(this.cache, function( entity){
        entity.dataStoreCachable = true;
      });
    } else {
      entity.dataStoreCachable = true;
    }
    
  };


  /**
   * Simple method to get the model/collection from the datastore
   * the method must first have been registered (see @register)
   * @returns {Mixed} [model or collection]
   * @throws {Error} - if no model/collection is saved in the cache
   */
  DataStore.prototype.getFromCache = function( filepath ) {
    if ( this.cache[filepath] !== undef ) {
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

    // Helper to check if the model or collection
    // has dataStoreCache flag on it saying not to cache
    // defaults to `true` (cachable)
    var isCacheable = function( entity ) {
      if (entity.dataStoreCachable !== undef ) {
        
        return entity.dataStoreCachable;
      }
      return true;
    };



    if ( obj === undef ) {
      try {
        _.each(this.cache, function(entity, key){
          if ( isCacheable( entity ) ) {
            var strData = JSON.stringify(entity.toJSON());
            root.localStorage.setItem(key, strData);
          }
        });
      } catch(e) {
        //local storage is probably not supported
      }
    } else {
      try {
        if ( isCacheable( obj ) ){
          var strData = JSON.stringify(obj.toJSON());
          root.localStorage.setItem(obj.dataStoreKey, strData);
        }
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

    if ( key === undef ) {
      throw new Error('Key not provided to get from localStorage');
    }
    var data;
    try {
      data = JSON.parse(root.localStorage.getItem(key));
    } catch(e) {
      //localStorage likely not supported
    }
    return data;
  };

  DataStore.prototype.removeFromLocalStorage = function( key ) {
    try {
      delete root.localStorage[key];
    } catch(e) {
      //silence
    }
  };


  //Backbone.$
  //for deferred
  //look at local storage
  //marionette page 219 (gentle introduction)
  //app.dataStore - mixin

  var dataStore;
  //dataStore is a singleton
  if ( Backbone.dataStore === undef ) {
    dataStore = new DataStore();
    Backbone.dataStore = dataStore;
  }

  dataStore.events.on('ready', function(){
    dataStore.isReady = true;
  });

}));