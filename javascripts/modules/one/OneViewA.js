define(['jquery',
        'backbone',
        'dataStore',
        'collections/OneCollection',
        'models/OneModel'], function( $, Backbone, dataStore, oneCollection, oneModel ) {

  var OneViewA = Backbone.View.extend({
    
    initialize: function(options) {
      _.bindAll(this, 'render', 'renderReady');
      var self = this;

      var contacts = dataStore.request('contacts');
      var someotherthing data

      contacts.get('name')

      dataStore.on('ready', oneCollection).then(function(){

      })
      options.model.id = '345345';
      dataStore.get(options.model).done(function( contacts ){
        //could get model like this as well now
        //self.model = dataStore.get('models/OneModel?id=1');
        //but its simpler to use it in the parameter callback
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