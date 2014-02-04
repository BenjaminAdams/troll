define(['App', 'jquery', 'underscore', 'backbone', 'hbs!template/header'],
    function(App, $, _, Backbone, HeaderTmpl) {
        return Backbone.Marionette.Layout.extend({
            template: HeaderTmpl,
            events: {
                //'click .tabmenu-right li': 'changeGridOption'
            },
            ui: {
                //'captioner': '#captioner',
                //'nextprev': '.nextprev'
            },
            regions: {
                //'postListing': '#postListing',
                //'captioner': '#captioner'
            },

            initialize: function(data) {
                _.bindAll(this);

            },
            onRender: function() {

            }

        });
    });