//good example: https://github.com/samccone/White-Board/blob/master/app.js
/*
Handles Status and Statuses
*/

var fs = require("fs");
var request = require('request');

module.exports = function(io, pool) {

    return {
        getAllFeatured: function() {

            pool.getConnection(function(err, connection) {
                //select * from status where active=1 ORDER BY priceOne desc
                connection.query("SELECT * FROM category_img,   wp_ekwgsx_terms WHERE term_id=cat_id  and good='1' order by inserted asc ", function(err, rows) {
                    if (err) {
                        console.log(err.message)
                        //res.send(400, err.message)
                        return;
                    }
                    var images = []
                    //console.log("rows=", rows);

                    connection.release();
                    rows.forEach(function(row) {
                        var filename = 'large-images/' + row.slug + '.jpg'
                        if (fs.existsSync(filename)) {
                            console.log(filename)
                            images.push(filename);
                        }

                    })

                    var builder = new Builder({
                        outputDirectory: 'sprites/',
                        outputImage: 'sprite.png',
                        outputCss: 'sprite.css',
                        selector: '.sprite',
                        images: images
                    });

                    builder.addConfiguration("legacy", {
                        pixelRatio: 0.3,
                        //outputImage: 'sprite.png'
                    });

                    builder.build(function() {
                        console.log("Built from " + builder.files.length + " images");
                    });

                });
            });
        },

    }

}