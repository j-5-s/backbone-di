define(['jquery', 'backbone', 'models/OneModel'], function( $, Backbone, OneModel ) {
    
  var c = Backbone.Collection.extend({
    model: OneModel,
    lookup: function (id) { //in collection
      var model;
      if (model = this.get(id)) {
          return $.Deferred().resolveWith(this, model);
      } else {
        model = new OneModel({id: id});
        return model.fetch();
      }
    }
  });

  return c;
});


