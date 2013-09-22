define(['jquery',
        'backbone',
        'dataStore'], function( $, Backbone, dataStore ) {

  var OneViewA = Backbone.View.extend({
    
    initialize: function(options) {
      _.bindAll(this, 'render', 'renderReady');
      var self = this;
      dataStore.events.on('ready:models/OneModel?id=1', function(oneModel){
        console.log('oneModel is ready');
      });

      dataStore.register(['collections/OneCollection', 'models/OneModel?id=1'])
                .done(function( oneCollection, oneModel ){
                  //could get model like this as well now
                  //self.model = dataStore.get('models/OneModel?id=1');
                  //but its simpler to use it in the parameter callback
                  self.model = oneModel;
                  self.model.on('change:name', self.renderReady);
                  self.renderReady();
                });

      dataStore.events.on('ready', function(){
        console.log('everything that was registered is ready');
      });
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
      this.$el.html('View loaded with model that has name \'' + this.model.get('name') + '\'');
      return this;
    }
  });

  return OneViewA;
});