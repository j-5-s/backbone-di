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
  DataStore.prototype.register = function( collections ) {
    var self = this;
    var dfd = $.Deferred();
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
        var params = {};
        if (typeof idMap[collections[i]] !== 'undefined') {
          var id = idMap[collections[i]];
          params.id = id;
          collections[i] += '?id=' + id;
        }
        self.cache[collections[i]] = new Arg(params);
        //fetch the data from the database
        //@todo, add local storage
        (function(obj,name){
          obj.fetch({async:false,success:function(modelOrCollection){
            self.events.trigger('ready:'+ name, obj);
            mDfd.resolve();
          }});
        }(self.cache[collections[i]],collections[i]));

        dfds.push(mDfd);
      });

      $.when.apply($, dfds).done(function(){
        dfd.resolve();
        self.events.trigger('ready');
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