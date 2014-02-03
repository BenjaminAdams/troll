define(['App', 'jquery', 'underscore', 'backbone', 'hbs!template/featuredPost'],
	function(App, $, _, Backbone, FeaturedPostTmpl) {
		return Backbone.Marionette.Layout.extend({
			template: FeaturedPostTmpl,
			tagName: 'li',

			events: {
				//'click .tabmenu-right li': 'changeGridOption'
			},
			ui: {
				'featuredImg': '.featuredImg',
				//'nextprev': '.nextprev'
			},

			initialize: function(data) {
				_.bindAll(this);
				this.model = data.model
				this.url = this.model.get('url')
				//this.model = new Backbone.Model({
				//bar: data.varTwo
				//})

				this.rendered = false
				App.on('testIfInViewPort', this.amIInView)

			},
			onRender: function() {
				var self = this
				setTimeout(function() {

					self.amIInView()
				}, 1)
			},
			amIInView: function(top) {
				if (this.rendered === false) {
					top = top || 0 //only query the window size if its not passed in

					var bounds = this.$el.offset();
					//console.log(bounds)

					if (top + 1200 > bounds.top) { //show img if its in the viewport
						//console.log(this.model.get('url'))
						//console.log(top, ' > ', bounds.top)

						this.ui.featuredImg.attr('src', this.model.get('url'))
						//App.off('testIfInViewPort')
						this.rendered = true
					}
				}

			}

		});
	});