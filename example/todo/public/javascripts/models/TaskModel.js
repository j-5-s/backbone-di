define(['jquery', 'backbone'], function( $, Backbone ) {
    
  var m = Backbone.Model.extend({
    defaults: {
      name: 'ModelOne'
    },
    url: 'http://localhost:8080/javascripts/one-model.json',
    initialize: function(options) {
      this.on('change:name', function() {
     
      });
    }
  });

  return m;
});