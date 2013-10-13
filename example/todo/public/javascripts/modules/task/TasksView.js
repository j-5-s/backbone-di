define(['jquery',
        'backbone',
        'modules/task/TaskView'
        ], function( $, Backbone, TaskView) {

  var TasksView = Backbone.View.extend({
    
    initialize: function(options) {
      _.bindAll(this, 'render', 'renderReady', 'renderTask');
      var self = this;
      //options.model.id = 1;
      Backbone.dataStore.lookup(['collections/TaskCollection']).done(function( taskCollection ){
        //could get model like this as well now
        //self.model = dataStore.lookup('models/OneModel?id=1');
        //but its simpler to use it in the parameter callback
        self.collection = taskCollection;
        self.collection.on('add', self.renderTask);
        self.renderReady();
      });
    },
    tagName:'ul',
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
      this.$el.html('');
      this.collection.each(this.renderTask);
      return this;
    },
    renderTask: function(m) {
      var taskView = new TaskView({model:m});
      this.$el.append(taskView.render().el);
    }
  });

  return TasksView;
});