define(['jquery',
        'backbone',
        ], function( $, Backbone) {

  var OneViewA = Backbone.View.extend({
    
    initialize: function(options) {
      _.bindAll(this, 'render', 'renderReady');
      var self = this;
      //options.model.id = 1;
      Backbone.dataStore.lookup([options.model],{reset:true}).done(function( oneModel ){
        //could get model like this as well now
        //self.model = dataStore.lookup('models/OneModel?id=1');
        //but its simpler to use it in the parameter callback
        
        //Backbone.dataStore.disableCache( oneModel );
        
        self.model = oneModel;
        self.model.on('change:name', self.renderReady);
        self.renderReady();
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