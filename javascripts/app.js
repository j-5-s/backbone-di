define(['jquery', 'backbone', 'modules/one/OneControler'], function( $, Backbone, OneController ) {
    


    return {
        start: function() {
           console.log('starting', OneController.start())
        }
    }
});