define(['App', 'jquery', 'underscore', 'backbone', 'hbs!template/singleCaption', 'view/baseView'],
    function(App, $, _, Backbone, SingleCaptionTmpl, BaseView) {
        return BaseView.extend({
            template: SingleCaptionTmpl,
            tagName: 'li',
            events: {
                //'click .tabmenu-right li': 'changeGridOption'
            },
            ui: {
                'thumbImg': '.thumbImg',
                //'nextprev': '.nextprev'
            },

            initialize: function(data) {
                _.bindAll(this);
                var self = this
                this.model = data.model
                this.url = this.model.get('url')
                this.renderedThis = false
                App.on('testIfInViewPort', this.amIInView)
                //$(window).on('scroll', this.checkSroll);

                //$(window).on("scroll", this.debouncer(function(e) {
                //console.log('I scrolled!')
                //App.trigger('testIfInViewPort', $(window).scrollTop())
                //}));

            },
            onClose: function() {
                App.off('testIfInViewPort')
            },

            onRender: function() {
                var self = this
                setTimeout(function() {
                    self.amIInView()
                }, 1)
            }

        });
    });