define(['App', 'jquery', 'underscore', 'backbone', 'hbs!template/captioner'],
    function(App, $, _, Backbone, CaptionerTmpl) {
        return Backbone.Marionette.Layout.extend({
            template: CaptionerTmpl,
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
                this.model = data.model
                console.log(this.model)

            },
            onRender: function() {

            }

        });
    });