//good example: https://github.com/samccone/White-Board/blob/master/app.js
/*
Handles Status and Statuses
*/

var fs = require("fs");
var request = require('request');

var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'AKIAI76FORJPOUF3FXIA',
    secretAccessKey: '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'
});
AWS.config.update({
    region: 'us-west-2'
});
var s3bucket = new AWS.S3({
    params: {
        Bucket: 'artoffx'
    }
});

module.exports = function(io, pool) {

    return {
        saveOne: function(res, req) {
            var self = this
            var values = req.body

            pool.getConnection(function(err, connection) {
                values = self.deleteDisplayValues(values)
                var query = connection.query('INSERT INTO status SET ?', values, function(err, result) {
                    if (err) {
                        res.send(400, err.message)
                        return;
                    }
                    console.log("insertID=", result.insertId);
                    //connection.end();
                    connection.release();
                    values.id = result.insertId

                    io.emit('new-status', values)
                    // for (var i = 0; i < io.sockets.length; ++i) {
                    //  io.sockets[i].emit('new-status', values);
                    // }

                    res.json(values);

                });
            });
        },
        uploadImg: function(res, req) {
            console.log('uploading img')
            var values = req.body
            var extension;
            var img = values.file

            switch (values.type) {

                case "image/jpeg":
                    extension = ".jpeg";
                    break;
                case "image/jpg":
                    extension = ".jpg";
                    break;
                case "image/png":
                    extension = ".png";
                    break;
                case "image/gif":
                    extension = ".gif";
                    break;
                default:
                    res.send(401, 'Bad img extension')
                    return

            }

            //$fileName = $slug.$extension;
            //$fullPath = $uploadsDir.$fileName;
            //file_put_contents($fullPath, base64_decode(substr($img, strpos($img, ",") + 1)));

            //substr($img, strpos($img, ",") + 1))

            img = img.substr(img.indexOf(",") + 1)

            var data = img.replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');

            var d = new Date();
            var year = d.getFullYear();
            var randomStr = year.toString() + Math.floor((Math.random() * 9999000000000000) + 1).toString();

            var fileName = randomStr + extension

            fs.writeFile("public/img/uploaded/" + fileName, buf, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");

                    res.send(200, "https://artoffx.com/img/uploaded/" + fileName)
                }
            });

        },
        // uploadImg: function(res, req) {
        //  console.log('uploading img')
        //  var values = req.body
        //  var extension;

        //  var data = values.file.replace(/^data:image\/\w+;base64,/, "");
        //  var buf = new Buffer(data, 'base64');

        //  switch (values.type) {

        //      case "image/jpeg":
        //          extension = ".jpeg";
        //          break;
        //      case "image/jpg":
        //          extension = ".jpg";
        //          break;
        //      case "image/png":
        //          extension = ".png";
        //          break;
        //      case "image/gif":
        //          extension = ".gif";
        //          break;
        //      default:
        //          res.send(401, 'Bad img extension')
        //          return

        //  }

        //  var d = new Date();
        //  var year = d.getFullYear();
        //  var randomStr = year.toString() + Math.floor((Math.random() * 9999000000000000) + 1).toString();
        //  var imgUrl = 'https://s3-us-west-2.amazonaws.com/artoffx/' + randomStr + extension

        //  var params = {
        //      Bucket: 'artoffx',
        //      Key: randomStr + extension,
        //      Body: buf
        //  };

        //  //console.log(params)

        //  s3bucket.putObject(params, function(perr, pres) {
        //      if (perr) {
        //          console.log("Error uploading data: ", perr);
        //          res.send(200, "/img/error.png")
        //      } else {
        //          console.log("Successfully uploaded", imgUrl);
        //          res.send(200, imgUrl)
        //      }

        //  });

        // },

        updateOne: function(res, values) {
            var self = this
            console.log('update one')
            pool.getConnection(function(err, connection) {
                var id = values.id
                values = self.deleteDisplayValues(values)
                console.log(values)
                var query = connection.query("update status SET ? where id='" + connection.escape(id) + "' ", values, function(err, result) {
                    if (err) {
                        res.send(400, err.message)
                        return;
                    }
                    console.log("updating=", values);
                    connection.release();

                    // for (var i = 0; i < io.sockets.length; ++i) {
                    //  io.sockets[i].emit('update-status-'+ id, values);
                    // }
                    io.emit('update-status-' + id, values)
                    res.json(values);

                });
            });

        },
        deleteOne: function(res, id) {
            pool.getConnection(function(err, connection) {
                var query = connection.query("delete from status where id=" + connection.escape(id), function(err, result) {
                    if (err) {
                        res.send(400, err.message)
                        return;
                    }

                    console.log('deleting id=', id)
                    io.emit('delete-status', id)
                    // for (var i = 0; i < io.sockets.length; ++i) {
                    //  io.sockets[i].emit('delete-status', id);
                    // }

                    var query = connection.query("delete from chat where statusid=" + connection.escape(id), function(err, result) {
                        connection.release();
                        res.send(200, 'ok');
                    });

                });
            });
        },
        readAllActive: function(res) {
            pool.getConnection(function(err, connection) {
                //select * from status where active=1 ORDER BY priceOne desc
                connection.query("select * from status where active=1 and (closedDate='0000-00-00' OR closedDate > date_sub(now(), interval 2 day))", function(err, rows) {
                    if (err) {
                        console.log(err.message)
                        res.send(400, err.message)
                        return;
                    }
                    //console.log("rows=", rows);
                    connection.release();
                    res.json(rows);

                });
            });

        },
        deleteDisplayValues: function(values) {
            delete values.tradeTypeDisplay
            delete values.currencyOneDisplay
            delete values.currencyTwoDisplay
            delete values.statusTitle
            delete values.color
            delete values.sortOrder
            delete values.createdAgo
            delete values.timePretty
            delete values.created //yes we want to delete created because we might try and override it with crap data
            return values
        },
        getAllChat: function(res, id) {
            pool.getConnection(function(err, connection) {

                if (id == 0) {

                    connection.query('select chat.id, displayName, username,body, userid, chat.created from chat, user where chat.userid= user.id AND statusid=' + connection.escape(id) + " and (chat.created > date_sub(now(), interval 2 day)) order by chat.id asc ", function(err, rows) {
                        if (err) {
                            console.log(err)
                            res.send(400, err.message)
                            return;
                        }
                        connection.release();
                        res.json(rows);

                    });
                } else {

                    connection.query('select chat.id, displayName, username,body,userid, chat.created from chat, user where chat.userid= user.id AND statusid=' + connection.escape(id) + ' order by chat.id asc', function(err, rows) {
                        if (err) {
                            res.send(400, err.message)
                            return;
                        }
                        connection.release();
                        res.json(rows);

                    });
                }
            });
        },
        chatDelete: function(res, req) {
            pool.getConnection(function(err, connection) {
                var id = req.param('id')
                var statusid = req.param('statusid')
                var query = connection.query("delete from chat where id=" + connection.escape(id), function(err, result) {
                    if (err) {
                        console.log(err)
                        res.send(400, err.message)
                        return;
                    }

                    console.log('deleting id=', id)
                    io.emit('delete-chat', id)

                    var query = connection.query("UPDATE status SET commentCount = commentCount - 1 WHERE id =" + connection.escape(statusid), function(err, result) {
                        connection.release();
                        res.send(200);
                    });

                });
            });
        },
        createChat: function(res, statusid, req) {
            var values = req.body
            values.statusid = statusid

            var now = new Date()
            var banUntil = new Date(req.session.banUntil)
            //check if user is banned from logging in
            if (banUntil > now) {
                console.log('banned from chat')
                res.send(401, 'Banned until: ' + req.session.banUntil)
                return;
            }

            pool.getConnection(function(err, connection) {
                values.userid = req.session.userid
                console.log('chat values=', values)
                var query = connection.query('INSERT INTO chat SET ?', values, function(err, result) {
                    if (err) {
                        res.send(400, err.message)
                        return;
                    }
                    console.log("insertID=", result.insertId);

                    values.id = result.insertId
                    values.username = req.session.username

                    connection.query('select  * from  user where id=' + connection.escape(req.session.userid), function(err, rows) {
                        if (err) {
                            console.log('error getting displayName', err.message)
                            res.send(400, err.message)
                            return;
                        }

                        values.displayName = rows[0].displayName || values.username;
                        io.emit('new-chat-' + values.statusid, values)
                        var query = connection.query("UPDATE status SET commentCount = commentCount + 1 WHERE id =" + connection.escape(statusid), function(err, result) {
                            connection.release();
                            res.json(values);
                        });

                    });

                });
            });
        },
        updateMainStatus: function(res, values) {
            var self = this
            console.log('update main status', values)
            pool.getConnection(function(err, connection) {
                if (values.value == '') {
                    values.value = " " //set it to at least one empty space character to prevent it being uneditable
                }
                console.log(values)
                var query = connection.query("update general SET ? where name='genstatus' ", values, function(err, result) {
                    if (err) {
                        res.send(400, err.message)
                        return;
                    }
                    connection.release();
                    io.emit('update-main-status', values)
                    res.json(values);

                });
            });

        },
        readMainStatus: function(res) {
            pool.getConnection(function(err, connection) {
                var query = connection.query("select value from general where name='genstatus' ", function(err, rows) {
                    if (err) {
                        res.send(400, err.message)
                        return;
                    }
                    //connection.end(); //this is crashing....
                    connection.release();
                    res.json(rows[0]);

                });
            });

        },
        getArchives: function(res, req) {
            pool.getConnection(function(err, connection) {
                //select * from status where active=1 ORDER BY priceOne desc
                connection.query("select * from status where closedDate != '0000-00-00' order by id desc", function(err, rows) {
                    if (err) {
                        res.send(400, err.message)
                        return;
                    }
                    //console.log("rows=", rows);
                    connection.release();
                    res.json(rows);

                });
            });
        }

    }

}