//good example: https://github.com/samccone/White-Board/blob/master/app.js
/*
Handles Status and Statuses
*/

var fs = require("fs");
var request = require('request');

module.exports = function(pool) {

    return {
        getAllFeatured: function(res, req) {

            pool.getConnection(function(err, connection) {
                //select * from status where active=1 ORDER BY priceOne desc
                connection.query("SELECT title, picurl, cat_id FROM memes WHERE good='1' order by inserted asc ", function(err, rows) {
                    if (err) {
                        console.log(err.message)
                        //res.send(400, err.message)
                        return;
                    }
                    var images = []

                    connection.release();
                    rows.forEach(function(row) {
                        var picurl = row.picurl

                        var split = picurl.split("/");
                        split[5] = 'featured.jpg'
                        picurl = split.join('/')

                        images.push({
                            id: row.cat_id,
                            url: picurl,
                            title: row.title
                        });

                    })

                    res.json(200, images)

                });
            });
        },

    }

}