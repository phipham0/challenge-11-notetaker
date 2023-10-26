const express = require('express');
const path = require('path');
const fs = require("fs")
const PORT = process.env.PORT || 3001;
const uuid = require('./helpers/uuid');
const { readFromFile, readAndAppend, writeToFile } = require('./helpers/fsUtils');
const app = express();
let notesdb = require('./db/notes.json');
console.log(notesdb);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// This API route is a GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// This API route is a POST Route for a new note
app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
        title,
        text,
        id: uuid(),
        };
        notesdb.push(newNote)
        //readAndAppend(newNote, './db/notes.json');
        fs.writeFileSync("./db/notes.json", JSON.stringify(notesdb))
        res.json(`Note added successfully`);
    } else {
        res.error('Error in adding note');
    }
});

// This API route is a DELETE Route for a note
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
    console.log(notesdb)
    // const requestNote = notesdb.filter(el => {
    //   console.log(el);
    //   el.id != id});
  let keepArray = []
  for (let i = 0; i < notesdb.length; i++){
    if(notesdb[i].id != id){
      keepArray.push(notesdb[i])
    }
  }
    notesdb = keepArray
    // console.log(requestNote)
    // const index = notesdb.indexOf(requestNote);
    // console.log(index)
    // notesdb.splice(index, 1);
    writeToFile('./db/notes.json', notesdb);
    res.send("DELETE Request Called")

})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
