const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/', (req, res) => {
  console.log('api route');

  res.sendFile(__dirname + '/index.html');
});

app.get('/api/video', (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send('Requires Range header');
  }
  console.log('----------------------------');
  console.log('range ' + range);
  const videoPath = 'sample.mp4';
  const videoSize = fs.statSync('sample.mp4').size;
  const Chunk_Size = 10 ** 6;
  const start = parseInt(range.replace('bytes=', '').split('-')[0]);
  const end = Math.min(start + Chunk_Size, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };
  console.log('start' + start);
  console.log('end ' + end);
  console.log('contentlength ' + contentLength);

  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
