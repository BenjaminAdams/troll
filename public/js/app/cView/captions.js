define(['App', 'backbone', 'jquery', 'view/singleCaption'],
    function(App, Backbone, $, SingleCaptionView) {
        //  return Backbone.Marionette.FasterCollectionView.extend({
        return Marionette.CollectionView.extend({
            itemView: SingleCaptionView,
            tagName: 'ul',
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