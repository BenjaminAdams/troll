define(['App', 'jquery', 'underscore', 'backbone', 'hbs!template/meme', 'view/captioner', 'model/meme', 'collection/captions'],
    function(App, $, _, Backbone, MemeTmpl, CaptionerView, MemeModel, CaptionsCollection) {
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
                'postListing': '.postListing',
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
                var self = this
                this.model.fetch({
                    success: this.showCaptioner,
                    error: this.failedMeme
                })

                //this.captions.fetch({
                //success: this.showCaptions
                //})

                //this.showCaptions(0)
            },
            showCaptioner: function() {
                var self = this
                this.captioner.show(new CaptionerView({
                    model: this.model
                }));

                this.captions = new CaptionsCollection([], {
                    cat_id: this.model.get('cat_id')
                })

                require(['cView/captions'], function(CaptionsCView) {
                    self.postListing.show(new CaptionsCView({
                        collection: self.captions
                    }))

                })

                this.captions.fetch()

            },
            failedMeme: function(e) {
                console.log('failed: ', e)
            },
            showCaptions: function() {
                var self = this

            }

        });
    });