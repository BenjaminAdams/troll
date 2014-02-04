define(['App', 'marionette', 'view/featuredPost'],
    function(App, Marionette, FeaturedPostView) {
        return Backbone.Marionette.CollectionView.extend({
            itemView: FeaturedPostView,
            tagName: 'ul',
            className: 'listing',
            initialize: function() {
                $(window).on("scroll", this.debouncer(function(e) {
                    console.log('I scrolled!')
                    App.trigger('testIfInViewPort', $(window).scrollTop())
                }));
            },
            onClose: function() {
                $(window).off("scroll");
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