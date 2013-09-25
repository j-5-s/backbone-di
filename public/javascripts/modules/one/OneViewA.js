define(['jquery',
        'backbone',
        'underscore',
        'backbone-di!collections/OneCollection',
        'backbone-di!models/OneModel?id=1'], function( $, Backbone, _, oneCollection, oneModel) {
  var OneViewA = Backbone.View.extend({
    
    initialize: function() {
      this.model = oneModel;
    },
    events: {
    },
    render: function(){
      this.$el.html('View loaded with model that has name \'' + this.model.get('name') + '\'');
      return this;
    },

  });

  return OneViewA;
});