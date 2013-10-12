define(['jquery', 'backbone', 'backbone-di', 'models/OneModel'], function($, Backbone, dataStore, OneModel) {
    describe('load dataStore', function() {


      it('gets through string', function() {
          var completed = false;
          waitsFor( function(){
            if (a && b && c && d) {
              completed = true;
            }
            return completed;
          },'Calls never completed', 10000);
          //runs( function(){
            var a, b, c, d;

            dataStore.lookup(['models/OneModel'],{reset:true}).done(function(oneModel){
              expect(oneModel).toBeDefined();
             // throw new Error('asdf')
              expect(oneModel.get('name')).toEqual('james');
              a = true;

            });
          //});

          // waitsFor( function(){
          //   return completed;
          // },'getString never completed', 10000);

          dataStore.lookup([{'models/OneModel':1}],{reset:true}).done(function(oneModel2){
            expect(oneModel2).toBeDefined();
            expect(oneModel2.get('name')).toEqual('james');
            b = true;
          });

          var oneModel3 = new OneModel();
          dataStore.lookup([oneModel3],{reset:true}).done(function(oneModel3){
            expect(oneModel3).toBeDefined();
            expect(oneModel3.get('name')).toEqual('ModelOne');
            c = true;
          });

          var oneModel4 = new OneModel();
          oneModel4.dataStoreKey = 'models/OneModel';
          oneModel4.id = 3;
          dataStore.lookup([oneModel4],{reset:true}).done(function(oneModel3){
            expect(oneModel4).toBeDefined();
            expect(oneModel4.get('name')).toEqual('ModelOne');
            d = true;
          });
      });
    });
});