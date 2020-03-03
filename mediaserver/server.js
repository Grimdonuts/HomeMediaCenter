const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const busboy = require('connect-busboy');

var originsWhitelist = [
  'http://localhost:4200',
  'http://192.168.1.19:4200',
  'http://127.0.0.1:4200'
];

var corsOptions = {
  origin: function (origin, callback) {
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
}

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

app.use(busboy({
  highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'));
});

app.get('/filenames', function (req, res) {
  const testFolder = './assets/';
  const fileNames = [];

  fs.readdirSync(testFolder).forEach(file => {
    if (path.extname(file) === '.mp4') {
      fileNames.push({ video: file, folder: null });
    } else if (path.extname(file) === '') {
      console.log(path.extname(file));
      var videosinfolder = [];
      fs.readdirSync(testFolder + file).forEach(foldercontents => {
        videosinfolder.push({video: foldercontents});
      });
      fileNames.push({ folder: file, children: videosinfolder });
    }
  });
  res.send(fileNames);
});

app.get('/video', function (req, res) {
  const videoname = req.param("video");
  const list = fs.readdirSync('./assets/');
  var path = "";
  if (list.includes(videoname)) {
    path = './assets/' + videoname;
  } else {
    list.forEach((file) => {
      if (fs.statSync('./assets/' + file).isDirectory()) {
        var foldercontents = fs.readdirSync('./assets/' + file);
        if (foldercontents.includes(videoname)) {
          path = './assets/' + file + '/' + videoname;
        }
      }
    })
  }

  if (path === '') {
    res.status(500).send('Bad Request');
    return;
  }
  const stat = fs.statSync(path);
  const fileSize = stat.size;

  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});
// Handle the upload post request
app.route('/fileupload').post((req, res, next) => {

  req.pipe(req.busboy); // Pipe it trough busboy

  req.busboy.on('file', (fieldname, file, filename) => {
    console.log(`Upload of '${filename}' started`);

    // Create a write stream of the new file
    const fstream = fs.createWriteStream(path.join('./assets/', filename));
    // Pipe it trough
    file.pipe(fstream);

    // On finish of the upload
    fstream.on('close', () => {
      console.log(`Upload of '${filename}' finished`);
      res.redirect('back');
    });
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000!')
});
