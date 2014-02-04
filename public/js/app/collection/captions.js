define(['App', 'backbone'], function(App, Backbone) {
	return Backbone.Collection.extend({
		initialize: function(models, data) {
			this.cat_id = data.cat_id || 'null'
			this.sortField = data.sortField || 'views'
			this.sortOrder = data.sortOrder || 'desc'
			this.after = data.after || 0
		},
		url: function() {
			/*  options
				cat_id: limit to specific category id or any type of post
				sort field: views or id
				sort order: asc or desc
				after:  when to start returning posts, builds the limit in the mysql qry
			*/

			return '/captions/' + this.cat_id + '/' + this.sortField + '/' + this.sortOrder + '/' + this.after + '.json'
		}

	});

});