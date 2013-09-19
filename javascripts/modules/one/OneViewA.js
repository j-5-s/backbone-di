define(['jquery',
        'backbone',
        'dataStore'], function( $, Backbone, dataStore ) {

  var OneViewA = Backbone.View.extend({
    
    initialize: function(options) {
      
      _.bindAll(this, 'render', 'renderReady');
      dataStore.register(['collections/OneCollection', 'models/OneModel?id=1']).done(this.renderReady);

    },
    events: {
    },
    //render turns into the a view that renders before the data is ready
    //commonly a loader
    render: function(){
      this.$el.html('loading... ');
      return this;
    },
    //renderReady gets called when the models have loaded (see initialize)
    renderReady: function() {
      this.model = dataStore.get('models/OneModel?id=1');
      this.$el.html('View loaded with model that has name \'' + this.model.get('name') + '\'');
      return this;
    }
  });

  return OneViewA;
});