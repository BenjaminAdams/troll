define(['App', 'underscore', 'backbone', ],
    function(App, _, Backbone) {
        return Backbone.Marionette.Layout.extend({
            amIInView: function(top) {
                if (this.renderedThis === false) {
                    top = top || 0 //only query the window size if its not passed in
                    console.log('calling amIInView')
                    var bounds = this.$el.offset();
                    //console.log(bounds)

                    if (top + 1200 > bounds.top && bounds.top !== 0) { //show img if its in the viewport
                        //console.log(this.model.get('url'))
                        //console.log(top, ' > ', bounds.top)
                        //console.log('rendering')
                        this.ui.thumbImg.attr('src', this.model.get('thumb'))
                        //App.off('testIfInViewPort')
                        this.renderedThis = true
                    }
                }

            },
            checkScroll: function() {
                var self = this
                console.log('checking scroll')
                this.debouncer(function(e) {
                    self.amIInView($(window).scrollTop())
                })
            },
            debouncer: function(func) {
                var timeoutID, timeout = timeout || 100;
                return function() {
                    var scope = this,
                        args = arguments;
                    clearTimeout(timeoutID);
                    timeoutID = setTimeout(function() {
                        func.apply(scope, Array.prototype.slice.call(args));
                    }, timeout);
                }
            },
        });

    });