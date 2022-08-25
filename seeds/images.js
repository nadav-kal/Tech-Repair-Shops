const fs = require('fs'),
    request = require('request');
const { set } = require('mongoose');

const download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

const myDownload = function() {
    let count = 1;
    for(let i = 0; i < 100; i++) {
        setTimeout(function () {
            download('https://source.unsplash.com/collection/946837', `../public/images/${count++}.jpeg`, function(){
            console.log('done');
            });
        }, i * 2000);
    }
}

myDownload();