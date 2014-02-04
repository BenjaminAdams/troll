define(['App', 'jquery', 'underscore', 'backbone', 'hbs!template/meme', 'view/captioner', 'model/meme'],
    function(App, $, _, Backbone, MemeTmpl, CaptionerView, MemeModel) {
        return Backbone.Marionette.Layout.extend({
            template: MemeTmpl,
            events: {
                //'click .tabmenu-right li': 'changeGridOption'
            },
            ui: {
                'captioner': '#captioner',
                //'nextprev': '.nextprev'
            },
            regions: {
                'postListing': '#postListing',
                'captioner': '#captioner'
            },

            initialize: function(data) {
                _.bindAll(this);

                this.page = data.page

                this.model = new MemeModel({
                    slug: data.slug
                })

            },
            onRender: function() {
                this.model.fetch({
                    success: this.showCaptioner,
                    error: this.failedMeme
                })
            },
            showCaptioner: function() {

                this.captioner.show(new CaptionerView({
                    model: this.model
                }));

            },
            failedMeme: function(e) {
                console.log('failed: ', e)
            }

        });
    });