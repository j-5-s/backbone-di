define(['jquery', 'backbone'], function( $, Backbone ) {

  var OneViewA = Backbone.View.extend({
    initialize: function(options) {
      this.mediator = options.mediator;
      this.router = options.router;
      _.bindAll(this, 'name');

      var self = this;
      _.each(this.events,function(val,key){
        console.log('setting up routes for v biew: one:'+ val + ' - fn' )
        self.mediator.on('one/' + val, self[val] );
      });
    },
    events: {
      'none': 'name'
    },
    "name": function(){
      console.log('in name: newName');
      this.render();
    },
    render: function(){
      console.log('rendering BView')
      this.$el.html('BView: name ' + this.model.get('name') );
      return this;
    },
    "test/b": function() {
      alert('something b clicked');
    }
  });

  return OneViewA;


});