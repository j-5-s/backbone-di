define(['jquery', 'backbone', 'dataStore'], function($, Backbone, dataStore) {
    describe('load dataStore', function() {


      it('gets via string', function() {
          var completed = false;
          
          waitsFor(function(){
            return completed;
          });
          dataStore.get(['models/OneModel']).done(function(oneModel){
            expect(oneModel).toBeDefined();
            expect(oneModel.get('name')).toEqual('james');
            completed = true;
          });
      });

      it('gets through string/id object', function(){

      });

      it ('gets through backbone object', function(){

      });
    });
});