describe('fn', function(){
  for (var key in window.localStorage) {
    window.localStorage.removeItem(key);
  }
  define(['jquery',
          'backbone',
          'backbone-di!models/OneModel?id=1',
          'backbone-di!collections/OneCollection'], 
    function($, Backbone, oneModel, oneCollection ) {
  
    describe('oneModel', function() {
      it('should return an instantiated version', function() {
        expect(oneModel).toBeDefined();
        expect(oneModel.get('name')).toEqual('james');
      });
    });

    describe('oneCollection', function(){
      it('should return a collection with one model', function(){
        expect(oneCollection.length).toEqual(1);
      });
    });
  });

});