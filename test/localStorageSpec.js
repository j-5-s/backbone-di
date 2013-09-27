require.config({
  backbonedi: {
    localStorage: true
  }
});

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

  describe('fetch oneModel again', function(){
    it('should return the instantiated model', function(){
      var ls    = window.localStorage,
          item  = ls.getItem('models/OneModel?id=1'),
          completed = false;
      expect(item).toBeDefined();
      expect(item).toEqual('{"id":"1","name":"james"}');

      waitsFor(function(){
        return completed;
      });

      require(['backbone-di!models/OneModel?id=1'], function(oneModel2){
          expect(oneModel2).toBeDefined();
          expect(oneModel.get('name')).toEqual('james');
          completed = true;
        });
      });
    });

  describe('oneCollection', function(){
    it('should return a collection with one model', function(){
      var ls    = window.localStorage,
          item  = ls.getItem('collections/OneCollection'),
          completed = false;

      waitsFor(function(){
        return completed;
      });

      expect(item).toBeDefined();
      expect(item).toEqual('[{"name":"james","id":"1"}]');
        require(['backbone-di!collections/OneCollection'], function(oneCollection2){
        expect(oneCollection2).toBeDefined();
        expect(oneCollection2.length).toEqual(1);
        completed = true;
      });
    });
  });
});