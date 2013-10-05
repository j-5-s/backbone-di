define(['jquery',
        'backbone',
        'modules/one/OneViewA',
        'dataStore!models/OneModel'
        ], function( $, Backbone, OneViewA, diOneModel) {
    return {
        start: function() {
          //OneViewA, requires a model, but that model
          //is called for within the view itself
          //it may already be in memory, localStorage
          //or if not, it will fetch from the server
          var oneViewA = new OneViewA({model:diOneModel});
          $('#oneViewA').html(oneViewA.render().el);
        }
    };
});