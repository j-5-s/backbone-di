define(['jquery',
        'backbone',
        'modules/one/OneViewA',
        'dataStore'], 
      function( $, Backbone, OneViewA, dataStore ) {

  var Router = Backbone.Router.extend({
    initialize: function( options ){
    },
    routes: {
      '': 'routeIt'
    },
    routeIt: function( url ) {
      console.log('main')
    }
  });

  var start = function (){

    //OneViewA, requires a model, but that model
    //is called for within the view itself
    //it may already be in memory, localStorage (@todo)
    //or if not, it will fetch from the server
    var oneViewA = new OneViewA();
    Backbone.history.start();
    $('#oneViewA').html(oneViewA.render().el);

    return {
      views: [oneViewA] 
    };
  }

  return {
    start: start
  }

});