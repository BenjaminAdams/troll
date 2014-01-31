define(['App', 'marionette', 'view/featuredPost'],
    function(App, Marionette, FeaturedPostView) {
        return Backbone.Marionette.CollectionView.extend({
            itemView: FeaturedPostView

        });
    });