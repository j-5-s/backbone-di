#Data Store

It's a dependency injection / IoC middleware for backbone with requirejs. Its a very similar style 
to requirejs module loading but the exception is that there is a middleware that will 
instantiate your models/collections if they dont exist in a local cache or localStorage 
and then fetch the data from the server.

## Install
You only need the single file located at public/javascripts/dataStore.js or the minified version. The rest of this
repo is for tests and a small bit of backbone/requirejs for buid/demo purposes

### Install the demo locally
```
git clone git@github.com:jamescharlesworth/backbone-di.git
npm install
node index.js
```
Then go to [localhost](http://localhost:8080/) on port 8080.

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


## A different way ( how to use )
Instantiate a view
```javascript
define(['jquery','backbone','modules/one/OneViewA'], 
  function( $, Backbone, OneViewA) {
  var oneViewA = new OnveViewA();
  $('body').html(oneViewA.render().el);
});
```

Figure out the models/collections you want from inside the view (see javascripts/modules/OneViewA.js 
for full example);

```javascript
define(['jquery', 'backbone', 'backbone-di!collections/OneCollection','backbone-di!models/OneModel?id=1'], 
  function( $, Backbone, oneCollection, oneModel ) {
  //notice in the requirejs define first paramter last argument of the array there is an `id?=1`
  //to grab the instantiate instance of that model.

  var OneViewA = Backbone.View.extend({
    
    initialize: function(options) {
      this.model = oneModel
    },
    events: {
    },
    render: function(){
      this.$el.html('View loaded with model that has name \'' + this.model.get('name') + '\'');
      return this;
    }
  });

  return OneViewA;
});
```

## Tests
Create a few test cases but requires the http node server to be running prior to running karma start.
```
node index.js
karma start
```

