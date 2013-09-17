define(['jquery',
        'backbone',
        'mediator',
        'modules/one/OneViewA',
        'modules/one/OneViewB',
        'dataStore'], 
      function( $, Backbone, mediator, OneViewA, OneViewB, dataStore ) {

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