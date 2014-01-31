define(['App', 'underscore', 'backbone', 'marionette'],
    function(App, _, Backbone, Marionette) {

        var AppRouter = Backbone.Marionette.AppRouter.extend({
            initialize: function(options) {
                //only runs once

            },
            routes: {
                '(/)': 'index',
                'foo2/:bar2(/)': 'foo2'
            },

            index: function(bar) {

                require(['view/index'], function(IndexView) {
                    App.mainRegion.show(new IndexView());
                })
            },
            foo2: function(bar2) {

                require(['view/foo2'], function(FooView2) {

                    App.mainRegion.show(new FooView2({
                        varOne: 'something something darkside',
                        varTwo: bar2 || 'bar not set'
                    }));
                })
            },

        });

        return AppRouter;

    });