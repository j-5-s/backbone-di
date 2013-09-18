define(['jquery', 'backbone', 'modules/one/OneController'], function( $, Backbone, OneController ) {
    


    return {
        start: function() {
           console.log('starting', OneController.start())
        }
    }
});