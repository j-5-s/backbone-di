define(['jquery',
        'backbone',
        'text!modules/task/task.html'
        ], function( $, Backbone, taskHtml) {

  var TaskView = Backbone.View.extend({
    
    initialize: function(options) {
      _.bindAll(this, 'render', 'deleteTask');
      var self = this;
      this.model.on('destroy', function(){
        self.off();
        self.$el.remove();
      });
    },
    tagName:'li',
    events: {
      'click a': 'deleteTask'
    },
    //render turns into the a view that renders before the data is ready
    //commonly a loader
    render: function(){
      var html = _.template(taskHtml, {model: this.model.toJSON()});
      this.$el.html(html);
      return this;
    },
    deleteTask: function( e ){
      e.preventDefault();
      this.model.destroy();
    }
  });

  return TaskView;
});