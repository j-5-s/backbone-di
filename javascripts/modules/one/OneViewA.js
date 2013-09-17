define(['jquery',
        'backbone',
        'text!modules/one/templates/form.html',
        'dataStore'], function( $, Backbone, form, dataStore ) {

  var OneViewA = Backbone.View.extend({
    
    initialize: function(options) {
      
      _.bindAll(this, 'render')
      var self = this;

      
      dataStore.register(['collections/OneCollection', 'models/OneModel'],function(){
        self.model = dataStore.get('models/OneModel');
        self.render();
      });

    
      var self = this;

      
    },
    events: {
      'click .something': 'test/test',
      'click a.link': 'changeName',
      'submit form': 'submitForm'
    },
    render: function(){
      if ( !dataStore.isReady ) {
        return this;
      }

      this.$el.html(form);
      return this;
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