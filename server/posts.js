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
            //console.log(req.values)
            console.log('slug=', slug)

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
                        row.url = split.join('/')

                        // images.push({
                        //     id: row.cat_id,
                        //     url: picurl,
                        //     title: row.title,
                        //     slug: row.slug
                        // });

                    })

                    res.json(200, rows)

                });
            });
        },

    }

}