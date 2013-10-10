define(['jquery',
        'backbone'
        ], function( $, Backbone) {

  var TaskView = Backbone.View.extend({
    
    initialize: function(options) {
      _.bindAll(this, 'render');
      var self = this;

    },
    tagName:'li',
    events: {
    },
    //render turns into the a view that renders before the data is ready
    //commonly a loader
    render: function(){
      this.$el.html(this.model.get('name'));
      return this;
    }
  });

  return TaskView;
});