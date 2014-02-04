define(['underscore', 'backbone', 'jquery'], function(_, Backbone, $) {
	return Backbone.Model.extend({
		initialize: function(data) {
			console.log('data=', data)
			this.slug = data.slug
		},
		url: function() {
			return "/meme/" + this.slug + ".json"
		}

	});
});