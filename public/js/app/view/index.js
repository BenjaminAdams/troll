define(['App', 'jquery', 'underscore', 'backbone', 'hbs!template/index', 'collection/featured', 'cView/featured'],
	function(App, $, _, Backbone, IndexTmpl, FeaturedCollection, FeaturedCV) {
		return Backbone.Marionette.Layout.extend({
			template: IndexTmpl,
			events: {
				//'click .tabmenu-right li': 'changeGridOption'
			},
			ui: {
				//'siteTable': '#siteTable',
				//'nextprev': '.nextprev'
			},
			regions: {
				'featuredListing': '#featuredListing',
			},
			initialize: function(data) {
				_.bindAll(this);

			},
			onRender: function() {
				App.featuredCollection = new FeaturedCollection()
				App.featuredCollection.fetch({
					success: this.loadFreaturedCV
				})

			},
			loadFreaturedCV: function() {
				console.log('in loadfeaturedcs in index')
				this.featuredListing.show(new FeaturedCV({
					collection: App.featuredCollection
				}))

			}

		});
	});