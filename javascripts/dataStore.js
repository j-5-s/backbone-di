define(['jquery', 'backbone'], function( $, Backbone ) {

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
  };



  /**
   * Registers collections or models
   * @param {Array} [collections] - requirejs file paths to grab
   * @returns {Deferred} - jQuery Deferred object loading is complete
   * @desc a ready event will get trigger when each model has been loaded
   * in the following naming convention ready:<file/path>
   * <file/path> being the value passed into the first parameter.
   * loading is complete.
   */
  DataStore.prototype.register = function( collections, options ) {
    var self = this;
    var dfd = $.Deferred();
    options = options || {};
    if (typeof options.reset === 'undefined') {
      options.reset = false;
    }
    //only add the collections that don't exist
    //so remove the ones that do
    var idMap = {};
    _.each(collections, function(name, i) {
      if (typeof self.cache[name] !== 'undefined') {
        collections.splice(i,1);
      }



      //check models for id's being passed and remove them if they exist
      var params = name.split('?');
      if (params.length > 1) {
        name = params[0];
        collections[i] = name;
        idMap[name] = params[1].substring('3', params[1].length);
      }
    });

    

    //instantiate the new models
    require(collections, function(){
      var args = slice.call(arguments);
      var dfds = [];
      _.each(args, function(Arg, i){
        var mDfd = $.Deferred();
        var params;
        if (typeof idMap[collections[i]] !== 'undefined') {
          params = {};
          var id = idMap[collections[i]];
          params.id = id;
          collections[i] += '?id=' + id;
        }

        //check for data in localStorage to populate with
        var data = self.getFromLocalStorage(collections[i]);

        if (data) {
          params = data;
        }
        self.cache[collections[i]] = new Arg(params);
        self.cache[collections[i]]._dataStoreKey = collections[i];
        self.cache[collections[i]].on('sync', function(model) {
          self.saveToLocalStorage( model );
        });
        //fetch the data from the database
        (function( obj, name, data ){
          if (data && !options.reset) {
            self.events.trigger('ready:'+ name, obj);
            mDfd.resolve();
          } else {
            obj.fetch().done(function(){
              self.events.trigger('ready:'+ name, obj);
              mDfd.resolve();
            });
          }


        }(self.cache[collections[i]],collections[i],data));

        dfds.push(mDfd);
      });

      $.when.apply($, dfds).done(function(){
        dfd.resolve();
        self.events.trigger('ready');
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
  DataStore.prototype.get = function( filepath ) {
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
        window.localStorage.setItem(obj._dataStoreKey, strData);
      } catch(e) {
        //local storage is probably not supported
      }
    }
  };

  DataStore.prototype.getFromLocalStorage = function( key ) {
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
  }

  var dataStore;

  if ( typeof window._dataStore === 'undefined') {
    dataStore = new DataStore();
    window._dataStore = dataStore;
  }


  dataStore.events.on('ready', function(){
    dataStore.isReady = true;
  });


  return dataStore;


});