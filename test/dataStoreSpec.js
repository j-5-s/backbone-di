define(['jquery', 'backbone', 'dataStore'], function($, Backbone, dataStore) {
    describe('load dataStore', function() {


      it('register', function() {
          var completed = false;
          
          waitsFor(function(){
            return completed;
          });
          dataStore.register(['models/OneModel']).done(function(oneModel){
            expect(oneModel).toBeDefined();
            expect(oneModel.get('name')).toEqual('james');
            completed = true;
          });
      });
    });
});