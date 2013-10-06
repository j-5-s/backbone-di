define(['jquery', 'backbone', 'dataStore', 'models/OneModel'], function($, Backbone, dataStore, OneModel) {
    describe('load dataStore', function() {


      it('gets through string', function() {
          var completed = false
          waitsFor( function(){
            if (a && b && c) {
              completed = true;
            }
            return completed;
          },'Calls never completed', 10000);
          //runs( function(){
            var a, b, c;

            dataStore.get(['models/OneModel']).done(function(oneModel){
              expect(oneModel).toBeDefined();
             // throw new Error('asdf')
              expect(oneModel.get('name')).toEqual('james');
              a = true;
            });
          //});

          waitsFor( function(){
            return completed;
          },'getString never completed', 10000);

          dataStore.get([{'models/OneModel':1}]).done(function(oneModel2){
            expect(oneModel2).toBeDefined();
            expect(oneModel2.get('name')).toEqual('james');
            b = true
          });

          var oneModel3 = new OneModel();
          dataStore.get([oneModel3]).done(function(oneModel3){
            expect(oneModel3).toBeDefined();
            expect(oneModel3.get('name')).toEqual('ModelOne');
            c = true;
          });
      });
    });
});