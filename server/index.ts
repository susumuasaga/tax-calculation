import express from 'express';
import * as superagent from 'superagent';
import * as path from 'path';

const app = express();
app.use('/node_modules', express.static('node_modules'));
app.use(
  ['/product', '/category', '/checkout', '/search', '/callback'],
  (req, res) => {
    res.sendFile(path.resolve('build/index.html'));
  }
);
app.use(express.static('dist'));
app.listen(3000);
