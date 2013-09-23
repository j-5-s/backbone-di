#Data Store

It's a dependency injection / IoC middleware for backbone with requirejs. Its a very similar style 
to requirejs module loading but the exception is that there is a middleware that will 
instantiate your models/collections if they dont exist in a local cache or localStorage 
and then fetch the data from the server.

## Install
```
npm install backbone-di
npm install
node index.js
```

## Use Case

With backbonejs you usually pass dependencies into views when you instantiate them like this:
```javascript
define(['jquery','backbone','modules/one/OneViewA', 'models/SomeModel'], function( $, Backbone, OneViewA, SomeModel) {
  var someModel = new SomeModel();
  var oneViewA = new OnveViewA({model:someModel});
  $('body').html(oneViewA.render().el);
});
```
The thing is its kind of more complex then that because you usually 
do some checks to see if you already have the model as well as other logic.


## A different way
Instantiate a view
```javascript
define(['jquery','backbone','modules/one/OneViewA'], function( $, Backbone, OneViewA) {
  var oneViewA = new OnveViewA();
  $('body').html(oneViewA.render().el);
});
```

Figure out the models/collections you want from inside the view (see javascripts/modules/OneViewA.js 
for full example);

```javascript
define(['jquery', 'backbone', 'dataStore'], function( $, Backbone, dataStore ) {

  var OneViewA = Backbone.View.extend({
    
    initialize: function(options) {
      _.bindAll(this, 'render', 'renderReady');
      var self = this;
      dataStore.register(['collections/OneCollection', 'models/OneModel?id=1'])
                .done(function( oneCollection, oneModel ){
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
```
### Listening to events
The `DataStore` object has the backbone event object on it and you can listen for `ready` and `ready:<eventname>`
events to fire.
```Javascript
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
```

## Tests
Create a few test cases but requires the http node server to be running prior to running karma start.
```
node index.js
karma start
```

