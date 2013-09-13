define(['jquery', 'backbone'], function( $, Backbone ) {
    return window.mediator = window.mediator ||  _.extend({},Backbone.Events);
});