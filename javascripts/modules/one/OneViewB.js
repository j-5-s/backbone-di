define(['jquery', 'backbone'], function( $, Backbone ) {

  var OneViewA = Backbone.View.extend({
    initialize: function(options) {
      this.mediator = options.mediator;
      this.router = options.router;
    },
    events: {
      'none': 'name'
    },
    render: function(){
      console.log('rendering BView')
      this.$el.html('BView: name ' + this.model.get('name') );
      return this;
    }
  });

  return OneViewA;


});