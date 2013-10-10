define(['jquery', 'backbone', 'modules/task/TasksView','modules/task/TaskFormView'], 
  function( $, Backbone, TasksView, TaskFormView) {
    return {
        start: function() {
          //OneViewA, requires a model, but that model
          //is called for within the view itself
          //it may already be in memory, localStorage
          //or if not, it will fetch from the server
          
          var tasksView = new TasksView();
          $('#app').html(tasksView.render().el);
          var taskFormView = new TaskFormView();
          $('#app').prepend(taskFormView.render().el);
        }
    };
});