define(['App', 'jquery', 'underscore', 'backbone', 'hbs!template/featuredPost', 'view/baseView'],
	function(App, $, _, Backbone, FeaturedPostTmpl, BaseView) {
		return BaseView.extend({
			template: FeaturedPostTmpl,
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
				this.model = data.model
				this.thumb = this.model.get('thumb')

				this.renderedThis = false
				App.on('testIfInViewPort', this.amIInView)

			},
			onRender: function() {
				var self = this
				setTimeout(function() {

					self.amIInView()
				}, 1)
			}

		});
	});