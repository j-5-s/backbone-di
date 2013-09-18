define(['jquery',
        'backbone',
        'text!modules/one/templates/form.html',
        'dataStore'], function( $, Backbone, form, dataStore ) {

  var OneViewA = Backbone.View.extend({
    
    initialize: function(options) {
      
      _.bindAll(this, 'render', 'renderReady');
      var self = this;

      dataStore.register(['collections/OneCollection', 'models/OneModel']).done(function(args){
        self.model = dataStore.get('models/OneModel');
        self.renderReady();
      });
    },
    events: {
      'click .something': 'test/test',
      'click a.link': 'changeName',
      'submit form': 'submitForm'
    },
    //render turns into the a view that renders before the data is ready
    //commonly a loader
    render: function(){
      this.$el.html('loading...');
      return this;
    },
    //renderReady gets called when the models have loaded (see initialize)
    renderReady: function() {
      this.$el.html(form);
      return this;
    }
  });

  return OneViewA;


});