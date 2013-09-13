define(['jquery', 'backbone'], function( $, Backbone ) {
    
  var m = Backbone.Model.extend({
    defaults: {
      name: 'ModelOne'
    },
    initialize: function(options) {
      var router = options.router
      this.on('change:name', function() {
        var name = this.get('name');
        console.log('navigating to one/name/'+name );
        router.navigate('one/name/:'+name, {trigger:true});
      })
    }
  });

  return m;
});