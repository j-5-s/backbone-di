define(['jquery',
        'backbone',
        'mediator',
        'modules/one/OneViewA',
        'modules/one/OneViewB',
        'models/OneModel'], 
      function( $, Backbone, mediator, OneViewA, OneViewB, OneModel ) {

  var Router = Backbone.Router.extend({
    initialize: function( options ){
      this.mediator = options.mediator;
    },
    routes: {
      '*actions': 'routeIt'
    },
    routeIt: function( url ) {
      url = url || '';
      args = url.split('/');
      console.log('routing to ' + args.join(':'))
      var params = [];
      _.each(args, function(arg){
        if (arg[0] === ':') {
          params.push(args.pop());
        }
      })
      mediator.trigger(args.join('/'), params);
    }
  });

  var start = function (){
    var r = new Router({mediator:mediator});
    var oneModel = new OneModel({router:r});

    var oneViewA = new OneViewA({mediator: mediator, router: r, model: oneModel});

    var oneViewB = new OneViewB({mediator:mediator, router:r, model: oneModel});

    Backbone.history.start();


    $('#oneViewA').html(oneViewA.render().el);

    $('#oneViewB').html(oneViewB.render().el);

    return {
      router: r,
      views: [oneViewA] 
    };
  }

  return {
    start: start
  }

});