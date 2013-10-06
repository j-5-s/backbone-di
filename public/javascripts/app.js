define(['jquery', 'backbone', 'modules/one/OneViewA'], function( $, Backbone, OneViewA ) {
    return {
        start: function() {
          //OneViewA, requires a model, but that model
          //is called for within the view itself
          //it may already be in memory, localStorage
          //or if not, it will fetch from the server
          var model = {'models/OneModel':1};
          var oneViewA = new OneViewA({model:model});
          $('#oneViewA').html(oneViewA.render().el);
        }
    };
});