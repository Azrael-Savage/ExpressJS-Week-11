document.addEventListener("DOMContentLoaded", () => {
	const notesList = document.getElementById("notes-list");
	const noteTitle = document.getElementById("note-title");
	const noteText = document.getElementById("note-text");
	const saveButton = document.getElementById("save-button");
  const writeButton = document.getElementById("write-button");

	// Rest of the code goes here

	let notes = [];

	// Fetch existing notes from the server and display them in the list
	fetch("/api/notes")
		.then((response) => response.json())
		.then((data) => {
			notes = data;
			renderNotes();
		})
		.catch((error) => {
			console.error("Error fetching notes:", error);
		});

	// Add event listeners for the save, write, and delete buttons
	saveButton.addEventListener("click", () => {
		const title = noteTitle.value;
		const text = noteText.value;
		if (title && text) {
			const note = { title, text, id: uuidv4() };
			notes.push(note);
			saveNoteToServer(note);
			clearNoteForm();
		}
	});

	writeButton.addEventListener("click", () => {
		clearNoteForm();
	});

	notesList.addEventListener("click", (event) => {
		if (event.target.classList.contains("delete-button")) {
			const noteId = event.target.dataset.noteId;
			deleteNoteFromServer(noteId);
		}
	});

	// Render the list of notes in the left-hand column
	function renderNotes() {
    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = "";
    const ul = document.createElement("ul");
    ul.classList.add("note-list");
    notes.forEach((note) => {
      const li = document.createElement("li");
      li.classList.add("note");
      const title = document.createElement("div");
      title.classList.add("note-title");
      title.innerText = note.title;
      const body = document.createElement("div");
      body.classList.add("note-body");
      body.innerText = note.text;
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.innerText = "Delete";
      deleteButton.dataset.noteId = note.id;
      li.appendChild(title);
      li.appendChild(body);
      li.appendChild(deleteButton);
      li.addEventListener("click", () => {
        renderNoteDetail(note);
      });
      ul.appendChild(li);
    });
    notesList.appendChild(ul);
    if (notes.length > 0) {
      renderNoteDetail(notes[0]);
    }
  }

	// Render the detail view for a selected note in the right-hand column
	function renderNoteDetail(note) {
		noteTitle.value = note.title;
		noteText.value = note.text;
	}

	// Clear the note form in the right-hand column
	function clearNoteForm() {
		noteTitle.value = "";
		noteText.value = "";
	}

	// Save a new note to the server using a POST request
	function saveNoteToServer(note) {
		fetch("/api/notes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(note),
		})
			.then((response) => response.json())
			.then((data) => {
				renderNotes();
				renderNoteDetail(data); // update detail view with new note
			})
			.catch((error) => {
				console.error("Error saving note:", error);
			});
	}

	// Delete a note from the server using a DELETE request
	function deleteNoteFromServer(noteId) {
		fetch(`/api/notes/${noteId}`, {
			method: "DELETE",
		}).then(() => {
			const noteIndex = notes.findIndex((note) => note.id === noteId);
			notes.splice(noteIndex, 1);
			renderNotes();
			clearNoteForm();
		});
	}
});
