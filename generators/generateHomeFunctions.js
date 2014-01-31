var fs = require("fs");
var request = require('request');
var async = require('async');
var db = require('../server/db');
var pool = db.create()

var Builder = require('node-spritesheet').Builder;

//keeps an array cached of all of the potential subreddit headers
var srHeaderImgs = {}
//var srHeaderImgsJson = '/tmp/my.json';
var srHeaderImgsJson = '../public/data/TMPsubredditList.json';
var currentlyGenerating = false //so we wont try generating 2 at once

/*

You will need to refactor this after you move to live

*/

//to reisze all images in a directory   convert '*.jpg[165x]' %03d.jpg

module.exports = {

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
					outputDirectory: '../server/sprites/',
					outputImage: 'sprite.png',
					outputCss: 'sprite.css',
					selector: '.sprite',
					images: images
				});

				builder.build(function() {
					console.log("Built from " + builder.files.length + " images");
				});

			});
		});
	},
	//downloads the images of the featured
	downloadAllFeatured: function() {
		var self = this

		pool.getConnection(function(err, connection) {
			//select * from status where active=1 ORDER BY priceOne desc
			connection.query("SELECT * FROM category_img,   wp_ekwgsx_terms WHERE term_id=cat_id  and good='1' order by inserted asc ", function(err, rows) {
				if (err) {
					console.log(err.message)
					//res.send(400, err.message)
					return;
				}
				var images = []
				//self.download(rows[2].picurl, rows[2].slug);
				connection.release();
				var count = 1;
				rows.forEach(function(row) {
					self.download(row.picurl, row.slug, count * 4000);
					count++;
				})

			});
		});
	},

	download: function(uri, slug, timeout) {
		try {
			setTimeout(function() {
				//console.log('adding ', slug, timeout, uri)
				request.head(uri, function(err, res, body) {

					if (typeof res !== 'undefined' && err === null) {
						//console.log('content-type:', res.headers['content-type']);
						//console.log('content-length:', res.headers['content-length']);
						var contentType = res.headers['content-type']

						//var extension = '.' + contentType.replace('image/', '')

						if (contentType.indexOf('html') == -1) {
							var filename = 'large-images/' + slug + '.jpg'
							//request(uri).pipe(fs.createWriteStream('large-images/' + slug + extension));

							fs.exists(filename, function(exists) {
								if (exists) {
									//the image exists
								} else {
									request(uri).pipe(fs.createWriteStream(filename));
								}
							});

						}
					}
				}).on('error', function(e) {
					console.log("Error: " + "\n" + e.message);
				});
			}, timeout)
		} catch (e) {
			console.log('failed to get ', slug)
		}
	},

	checkTimeStampToRefreshImgs: function() {
		var self = this
		fs.stat(srHeaderImgsJson, function(err, stats) {
			if (err) {
				console.log('its an error, lets generate')
				self.generateHeaderImgs()
			} else {

				var t1 = new Date()
				var t2 = new Date(stats.ctime)
				var diff = t1.getTime() - t2.getTime()
				//fetch new header images every (60×60×24×4)x1000 seconds
				console.log('diff=', diff)
				//if (diff > 34560000) {
				if (diff > 88) {
					self.generateHeaderImgs()
				}
			}

		})

	},
	fetchHeaderImg: function(id, next) {
		var options = {
			url: 'http://api.reddit.com/r/' + id + '/about.json'
		}

		request.get(options, function(error, response, body) {
			//for some reason its responding with ' undefined'  with a space sometimes
			if (error || typeof body === 'undefined' || body == 'undefined') {
				next('null')
				return
			}

			console.log('body=', body)
			console.log('resp from url=', options.url)

			var body = JSON.parse(body)

			if (typeof body.data !== 'undefined') {
				next(body.data.header_img)
			} else {
				next('null')
			}

		});
	},
	generateHeaderImgs: function() {
		var self = this
		if (currentlyGenerating == false) {
			currentlyGenerating = true
			var inpufile = '../public/data/subredditList.json';
			fs.readFile(inpufile, 'utf8', function(err, data) {
				if (err) {
					console.log('Error: ' + err);
					currentlyGenerating = false
					return;
				}
				data = JSON.parse(data);

				async.forEach(Object.keys(data), function(key, callback) {
					var category = data[key];
					//console.log(key)
					async.forEach(Object.keys(category), function(srkey, secondCallback) {
						var category = data[key];
						srHeaderImgs[key] = []
						self.fetchHeaderImg(category[srkey], function(img) {
							console.log(img)
							//srHeaderImgs[category].imgUrl = img
							srHeaderImgs[key].push({
								header_img: img,
								display_name: category[srkey]
							})
							secondCallback() // tell async that the iterator has completed
						})

					}, function(err) {
						callback();
						//console.log('category done', key);
					});

				}, function(err) {
					console.log('generate file now!');

					fs.writeFile(srHeaderImgsJson, JSON.stringify(srHeaderImgs, null, 4), function(err) {
						currentlyGenerating = false
						if (err) {
							console.log(err);
						} else {
							console.log("JSON saved to " + srHeaderImgsJson);
						}
					});
				});

			});
		}
	}

}