const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const app = express();
app.use(express.json());

const mapCache = {};

app.use('/', express.static(path.join(__dirname, '..', 'client', 'dist')));

// map saving
app.post('/map', (req, res) => {
  console.log(`Saving Map, "${req.body.name}"`);
  // save to cache
  mapCache[req.body.name] = req.body.grid;

  // save to file
  fs.writeFile(path.join(__dirname, '..', 'maps', `${req.body.name}.map`),
    req.body.grid, () => {
      res.status(201).send('Map Successfully Saved');
    });
});

// map loading
app.get('/map/:mapName', (req, res) => {
  console.log(`Loading Map, "${req.params.mapName}"`);
  if (mapCache[req.params.mapName]) {
    // load from cache if available
    res.status(200).send({ mapFound: true, mapData: mapCache[req.params.mapName] });
  } else {
    // otherwise, load from file
    fs.readFile(path.join(__dirname, '..', 'maps', `${req.params.mapName}.map`), 'utf8',
      (err, data) => {
        if (err) {
          console.log(err);
          res.status(200).send({ mapFound: false });
        } else {
          res.status(200).send({ mapFound: true, mapData: data });
        }
      });
  }
});

app.listen(PORT, () => console.log(`Server ready, listening on ${PORT}`));
