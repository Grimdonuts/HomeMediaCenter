const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const modPlaylists = require('./model/model').Playlists;

const db = mongoose.connection;
mongoose.connect('mongodb://192.168.1.19:27017/mediaserver', {useNewUrlParser: true, useUnifiedTopology: true}); // mongodb://user:pass@address:port/dbname
db.on('error', console.error.bind(console, 'connection error:')); // 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@192.168.1.19:27017/mediaserver'
db.once('open', () => {
  console.log("Connected to the DB");
});

const originsWhitelist = [
  'http://192.168.1.19:4200',
  'http://localhost:4200',
  'http://127.0.0.1:4200'
];

const corsOptions = {
  origin: (origin, callback) => {
    const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
}

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

app.use(busboy({
  highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
}));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.htm'));
});

app.get('/filenames', (req, res) => {
  let testFolder = './assets/';
  let fileNames = [];
  let fileIndex = 0;

  fs.readdirSync(testFolder).forEach(file => {
    if (path.extname(file) === '.mp4') {
      let imageFile = file.replace('.mp4', '.jpg');
      fileNames.push({ video: file, folder: null, image: imageFile, index: fileIndex });
    } else if (path.extname(file) === '') {
      let videosinfolder = [];
      fs.readdirSync(testFolder + file).forEach(foldercontents => {
        videosinfolder.push({ video: foldercontents });
      });
      fileNames.push({ folder: file, image: file + '.jpg', index: fileIndex, children: videosinfolder });
    }
    fileIndex++;
  });
  res.send(fileNames);
});

app.get('/foldercheck', (req, res) => {
  let videoname = req.query.filename;
  let list = fs.readdirSync('./assets/');
  let nextprevious = [];
  if (!list.includes(videoname)) {
    list.forEach((file) => {
      if (fs.statSync('./assets/' + file).isDirectory()) {
        let foldercontents = fs.readdirSync('./assets/' + file);
        if (foldercontents.includes(videoname)) {
          let index = foldercontents.indexOf(videoname);
          let previousFile = '';
          let nextFile = '';
          if (index !== 0 && nextprevious.length === 0) {
            previousFile = foldercontents[index - 1];
          }
          if (index !== foldercontents.length) {
            nextFile = foldercontents[index + 1];
          }
          nextprevious.push({ previous: previousFile, next: nextFile });
        }
      }
    });
  }
  res.send(nextprevious);
});

app.get('/video', (req, res) => {
  let videoname = req.query.video;
  let list = fs.readdirSync('./assets/');
  let path = '';
  if (list.includes(videoname)) {
    path = './assets/' + videoname;
  } else {
    list.forEach((file) => {
      if (fs.statSync('./assets/' + file).isDirectory()) {
        let foldercontents = fs.readdirSync('./assets/' + file);
        if (foldercontents.includes(videoname)) {
          path = './assets/' + file + '/' + videoname;
        }
      }
    });
  }

  if (path === '') {
    res.status(500).send('Bad Request');
    return;
  }
  let stat = fs.statSync(path);
  let fileSize = stat.size;

  let range = req.headers.range

  if (range) {
    let parts = range.replace(/bytes=/, '').split('-')
    let start = parseInt(parts[0], 10)
    let end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    let chunksize = (end - start) + 1
    let file = fs.createReadStream(path, { start, end })
    let head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head)
    file.pipe(res)
  } else {
    let head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

app.get('/image', (req, res) => {
  let seriesname = req.query.video;
  let list = fs.readdirSync('./assets/');
  let path = '';
  if (list.includes(seriesname)) {
    path = '/assets/' + seriesname;
  } else {
    list.forEach((file) => {
      if (fs.statSync('./assets/' + file).isDirectory()) {
        let foldercontents = fs.readdirSync('./assets/' + file);
        if (foldercontents.includes(seriesname)) {
          path = '/assets/' + file + '/' + seriesname;
        }
      }
    });
  }
  res.sendFile(__dirname + path);
});

app.post('/fileupload', (req, res) => {
  req.pipe(req.busboy);

  req.busboy.on('file', (fieldname, file, filename) => {
    console.log(`Upload of '${filename}' started`);

    let fstream = fs.createWriteStream(path.join('./assets/', filename));
    file.pipe(fstream);

    fstream.on('close', () => {
      console.log(`Upload of '${filename}' finished`);
    });
  });
  req.busboy.on('finish', () => {
    res.redirect(req.get('referer') + 'upload');
  });
});

app.post('/playlistcreate', async (req, res) => {
  let playlistBody = JSON.stringify(req.body).replace('{', '').replace('}', '');
  let playlistArray = playlistBody.split(',');
  let playlistName = playlistArray.pop().replace('"playlistname":"', '').replace('"', '');
  for (let i = 0; i < playlistArray.length; i++) {
    playlistArray[i] = playlistArray[i].replace('":"on"', '').replace('"', '');
  }

  await modPlaylists.create({
    playlistname: playlistName,
    videos: playlistArray
  });

  let dbRecord = await modPlaylists.findOne({ playlistname: playlistName });
  let redirectPath = req.get('referer').replace('createplaylist', '');
  res.redirect(redirectPath + 'playlistorder?id='+ dbRecord.id);
});

app.get('/playlist', async (req, res) => {
  let playlistid = req.query.id;
  let dbRecord = await modPlaylists.findOne({ _id: playlistid });
  res.send(dbRecord);
});

app.get('/playlists', async (req, res) => {
  let dbRecord = await modPlaylists.find();
  res.send(dbRecord);
});

app.post('/playlistorder', async (req, res) => {
  let playlistBody = JSON.stringify(req.body).replace('{"video":[', '').replace('}', '').replace(']', '');
  let playlistArray = playlistBody.split(',');
  let playlistId = playlistArray.pop().replace('"playlistId":"', '').replace('"', '');
  for (let i = 0; i < playlistArray.length; i++) {
    playlistArray[i] = playlistArray[i].replace('"', '').replace('"', '');
  }
  await modPlaylists.updateOne({ _id: playlistId }, { $set: { videos: playlistArray }});
  let redirectPath = req.get('referer').replace('playlistorder', '');
  res.redirect(redirectPath + 'playlists');
});

app.listen(3000, () => {
  console.log('Listening on port 3000!')
});
