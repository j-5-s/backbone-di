lookup: function (id) { //in collection
  var model;
  if (model = this.get(id)) {
      return $.Deferred().resolveWith(this, model);
  } else {
    model = new Model({id: id});
    return model.fetch();
  }
}
