define(['jquery', 'backbone', 'models/TaskModel'], function( $, Backbone, TaskModel ) {
    
  var c = Backbone.Collection.extend({
    model: TaskModel,
    url: 'http://localhost:8080/javascripts/one-collection.json'
  });

  return c;
});


