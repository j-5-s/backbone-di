# Backbone DI

Backbone DI is a RequireJS plugin for Backbone. It's a dependency injection / IoC middleware
that will instantiate your models/collections if they don't exist in a local cache or localStorage 
(optional) and then fetch the data from the server. If they do exist, it will use the existing collections
and models it has already instantiated.  The goal is to take a lot of the model / collection
logic out of the views and just provide the objects for you immediately.

## Install
You only need the single file located at public/javascripts/backbone-di.js. The rest of this
repo is for tests and a small bit of backbone/requirejs for buid/demo purposes. Place that file
in your root requirejs folder (like the text.js plugin).

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


## A different way (how to use)
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
  //notice in the require.js `define` first parameter last argument of the array there is an `id?=1`
  //to grab the instantiate instance of that model.

  //Also, oneCollection is instantiated as well.

  //for this example both objects will call fetch to javascripts/one-collection.json and
  //javascripts/one-model.json to show how to fetch the data.

  var OneViewA = Backbone.View.extend({
    
    initialize: function(options) {
<<<<<<< HEAD
      this.model = oneModel
=======
      _.bindAll(this, 'render', 'renderReady');
      var self = this;
      dataStore.get(['collections/OneCollection', {'models/OneModel':1}]).done(function( oneCollection, oneModel ){
        //could get model like this as well now
        //self.model = dataStore.get('models/OneModel?id=1');
        //but its simpler to use it in the parameter callback
        self.model = oneModel;
        self.model.on('change:name', self.renderReady);
        self.renderReady();
      });
>>>>>>> require-move
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
It's up to you when you want to use this pattern as opposed to passing the model into the view
directly as its a case by case basis as to what's best.

## localStorage option
You may configure backbone-di to use localStorage for quicker access to data. This is done via 
requirejs config option `backbonedi.localStorage`:
```javascript
require.config({
  backbonedi: {
    localStorage: true
  }
});
```

## Tests
Create a few test cases but requires the http node server to be running prior to running karma start.
```
node index.js
karma start
```

