const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Serve static files from the public directory
app.use(express.static("public"));

// Set up the middleware for parsing JSON data in the request body
app.use(express.json());

// Route for returning the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route for returning the notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// Route for returning all saved notes as JSON
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (error, data) => {
    if (error) {
      console.error(error);
      res.status(500).end();
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

// Route for saving a new note to the db.json file
app.post("/api/notes", (req, res) => {
  const note = req.body;
  note.id = uuidv4();
  fs.readFile("./db/db.json", "utf8", (error, data) => {
    if (error) {
      console.error(error);
      res.status(500).end();
    } else {
      const notes = JSON.parse(data);
      notes.push(note);
      fs.writeFile("./db/db.json", JSON.stringify(notes), (error) => {
        if (error) {
          console.error(error);
          res.status(500).end();
        } else {
          res.json(note);
        }
      });
    }
  });
});

// Route for deleting a note from the db.json file
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile("./db/db.json", "utf8", (error, data) => {
    if (error) {
      console.error(error);
      res.status(500).end();
    } else {
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (error) => {
        if (error) {
          console.error(error);
          res.status(500).end();
        } else {
          res.status(204).end();
        }
      });
    }
  });
});

// Start the server and listen for incoming requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
