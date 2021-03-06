define(['App', 'underscore', 'backbone', 'marionette', 'view/header'],
    function(App, _, Backbone, Marionette, HeaderView) {

        var AppRouter = Backbone.Marionette.AppRouter.extend({
            initialize: function(options) {
                //only runs once
                App.headerRegion.show(new HeaderView())
            },
            routes: {
                '(/)': 'index',
                'meme/:slug(/)': 'meme', //category view
                'meme/:slug/:page(/)': 'meme'
            },

            index: function(bar) {

                require(['view/index'], function(IndexView) {
                    App.mainRegion.show(new IndexView());
                })
            },
            meme: function(slug, page) {

                require(['view/meme'], function(MemeView) {

                    App.mainRegion.show(new MemeView({
                        slug: slug,
                        page: page || 1
                    }));
                })
            },

        });

        return AppRouter;

    });