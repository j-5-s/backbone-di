define(['jquery', 'underscore', 'backbone', 'app'], function($, _, Backbone, app) {
    describe('ap loads', function() {
        it('works for underscore', function() {
            // just checking that _ works
            expect(_.size([1,2,3])).toEqual(3);
        });
    });

});