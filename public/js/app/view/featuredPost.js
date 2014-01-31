define(['App', 'jquery', 'underscore', 'backbone', 'hbs!template/featuredPost'],
	function(App, $, _, Backbone, FeaturedPostTmpl) {
		return Backbone.Marionette.Layout.extend({
			template: FeaturedPostTmpl,
			events: {
				//'click .tabmenu-right li': 'changeGridOption'
			},
			ui: {
				//'siteTable': '#siteTable',
				//'nextprev': '.nextprev'
			},

			initialize: function(data) {
				_.bindAll(this);

				//this.model = new Backbone.Model({
				bar: data.varTwo
				//})

			},
			onRender: function() {
				console.log('post rendered')
			}

		});
	});