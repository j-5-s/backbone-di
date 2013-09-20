var tests = [];
for (var file in window.__karma__.files) {
    if (/Spec\.js$/.test(file)) {
        tests.push(file);
    }
}

//unit tests need chrome obj
var chrome = { tabs: {} };
chrome.tabs.getSelected = function(tab, cb) {
    var t = {
        url: 'http://somedummyurl'
    };
    cb.call(null, t);
};

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/javascripts',

  "paths": {
    'jquery': 'vendor/jquery-1.10.2.min',
    'backbone' : 'vendor/backbone-min',
    'underscore': 'vendor/underscore-min'
  },
  shim: {
   'underscore': {
      "exports": '_'
    },
    "backbone": {
      "deps": [
        "underscore",
        "jquery"
      ],
      "exports": "Backbone"
    }
  },
  // ask Require.js to load these files (all our tests)
  deps: tests,
  // start test run, once Require.js is done
  callback: window.__karma__.start
});
