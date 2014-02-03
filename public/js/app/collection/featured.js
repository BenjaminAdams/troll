define(['App', 'backbone'], function(App, Backbone) {
    return Backbone.Collection.extend({
        //model: SingleModel,
        //url: '/data/featured.json'
        url: '/featured.json'

    });

});