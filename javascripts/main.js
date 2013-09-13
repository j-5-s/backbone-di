// Filename: main.js
// This file is built from createMain
// Do not update it manually. Update the build options
require.config({
  "paths": {
    'jquery': 'vendor/jquery-1.10.2.min',
    'backbone' : 'vendor/backbone-min',
    'underscore': 'vendor/underscore-min'
  },
  shim: {
   'underscore': {
          exports: '_'
      },
      "backbone": {
        "deps": [
          "underscore",
          "jquery"
        ],
        "exports": "Backbone"
      }
  }
});


require(['app'], function(App){

    App.start();
});