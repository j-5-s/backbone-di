define(['jquery', 'backbone', 'modules/one/OneViewA','di!product'], function( $, Backbone, OneViewA, contacts ) {
    return {
        start: function() {
          //OneViewA, requires a model, but that model
          //is called for within the view itself
          //it may already be in memory, localStorage
          //or if not, it will fetch from the server
          var oneViewA = new OneViewA({model: product});
          $('#oneViewA').html(oneViewA.render().el);
        }
    };
});