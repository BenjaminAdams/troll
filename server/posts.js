//good example: https://github.com/samccone/White-Board/blob/master/app.js
/*
Handles Status and Statuses
*/

var fs = require("fs");
var request = require('request');

module.exports = function(pool) {

    return {

        getOne: function(res, req) {
            var slug = req.param('slug')

            pool.getConnection(function(err, connection) {
                connection.query("SELECT title, picurl, cat_id,slug,good FROM memes WHERE slug=" + connection.escape(slug) + " limit 1 ", function(err, rows) {
                    if (err) {
                        console.log(err.message)
                        res.send(400, err.message)
                        return;
                    }

                    connection.release();

                    res.json(200, rows[0])

                });
            });

        },
        getCaptions: function(res, req) {
            //captions/:cat_id/:sortField/:sortOrder/:after.json

            var postsPerPage = 25;

            var cat_id = req.param('cat_id')
            var sortField = req.param('sortField')
            var sortOrder = req.param('sortOrder') || desc
            var after = req.param('after')

            var catIdStr = ''
            var sortFieldStr = ''
            var limitStr = " limit " + after + ', ' + postsPerPage

            pool.getConnection(function(err, connection) {

                //build query string based on input options
                if (cat_id != 'null') { //we pass in a string of null
                    catIdStr = " cat_id=" + connection.escape(cat_id)
                }

                if (sortField != 'null') {
                    sortFieldStr = ' order by ' + sortField + ' ' + sortOrder
                }

                connection.query("SELECT ID, title, imgURL, thumb, views, cat_id,guid FROM captions WHERE " + catIdStr + sortFieldStr + limitStr, function(err, rows) {
                    if (err) {
                        console.log(err.message)
                        //res.send(400, err.message)
                        return;
                    }
                    var images = []

                    connection.release();
                    rows.forEach(function(row) {

                    })

                    res.json(200, rows)

                });
            });
        },
        getAllFeatured: function(res, req) {

            pool.getConnection(function(err, connection) {
                //select * from status where active=1 ORDER BY priceOne desc
                connection.query("SELECT title, picurl, cat_id,slug FROM memes WHERE good='1' order by inserted asc ", function(err, rows) {
                    if (err) {
                        console.log(err.message)
                        //res.send(400, err.message)
                        return;
                    }
                    var images = []

                    connection.release();
                    rows.forEach(function(row) {
                        var split = row.picurl.split("/");
                        split[5] = 'featured.jpg'
                        row.thumb = split.join('/')

                    })

                    res.json(200, rows)

                });
            });
        },

    }

}