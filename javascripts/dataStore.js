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
   * @param {Array} [filePaths] - requirejs file paths to grab
   * @param {Function} [complete] - Optional callback to fire when module
   * loading is complete.
   */
  DataStore.prototype.register = function(collections, complete) {
    var self = this;
    //only add the collections that don't exist
    _.each(collections, function(name, i) {
      if (typeof self.cache[name] !== 'undefined') {
        collections.splice(i,1);
      }
    });

    require(collections, function(){
      var args = slice.call(arguments);
      _.each(args, function(arg,i){
        self.cache[collections[i]] = new arg();
      });

      var data = _.toArray(self.cache)
      self.events.trigger('ready',data);
      if (typeof complete !== 'undefined') {
        complete.apply(self, data);
      } 
    });
  };

  DataStore.prototype.get = function( filepath ) {
    if (typeof this.cache[filepath] !== 'undefined') {
      return this.cache[filepath];
    }

    throw new Error( filepath + ' has not been registered' );
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