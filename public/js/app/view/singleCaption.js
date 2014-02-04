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
                _.bindAll(this, 'amIInView');
                var self = this
                this.model = data.model
                this.url = this.model.get('url')

                this.renderedThis = false
                //App.on('testIfInViewPort', this.amIInView)
                $(window).scroll(this.checkSroll);

            },
            onClose: function() {
                console.log('closing view')
                //$(window).unbind("scroll", scrollHandler);
                //$(window).off("scroll", this.checkSroll);
            },

            onRender: function() {
                var self = this
                setTimeout(function() {
                    self.amIInView()
                }, 1)
            }

        });
    });