define(['jquery', 'backbone', 'models/OneModel'], function( $, Backbone, OneModel ) {
    
  var c = Backbone.Collection.extend({
    model: OneModel,
    url: 'http://localhost:9003/one-collection.json'
  });

  return c;
});


