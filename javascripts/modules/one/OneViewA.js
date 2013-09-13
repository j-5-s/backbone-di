define(['jquery', 'backbone', 'text!modules/one/templates/form.html'], function( $, Backbone, form ) {

  var OneViewA = Backbone.View.extend({
    initialize: function(options) {
      this.mediator = options.mediator;
      this.router = options.router;

      var self = this;
      _.each(this.events,function(val,key){
        self.mediator.on('one:' + val, self[val] );
      });
    },
    events: {
      'click .something': 'test:test',
      'click a.link': 'changeName',
      'submit form': 'submitForm'
    },
    render: function(){
      this.$el.html(form);
      return this;
    },
    "test:test": function() {
      alert('something clicked');
    },
    "changeName": function(e) {
      e.preventDefault();
      console.log('changeName clicked')
      this.model.set('name', 'newName');
    },
    submitForm: function(e) {
      e.preventDefault();
      var name = $('form').find('input').val();
      this.model.set('name', name);
    }
  });

  return OneViewA;


});