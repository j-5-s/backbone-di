define(['jquery', 'backbone', 'backbone-di!models/OneModel?id=1'], function($, Backbone, oneModel) {
    describe('backbone-di', function() {
      it('loads the dependency', function() {
          expect(oneModel).toBeDefined();
          expect(oneModel.get('name')).toEqual('james');
      });
    });
});