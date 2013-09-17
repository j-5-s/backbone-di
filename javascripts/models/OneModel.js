define(['jquery', 'backbone'], function( $, Backbone ) {
    
  var m = Backbone.Model.extend({
    defaults: {
      name: 'ModelOne'
    },
    url: 'http://localhost:9003/one-collection.json',
    initialize: function(options) {
      this.on('change:name', function() {
     
      });
    }
  });

  return m;
});