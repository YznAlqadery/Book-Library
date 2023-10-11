// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import {
  getDatabase,
  push,
  ref,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  databaseURL:
    "https://library-22e31-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const booksInDatabase = ref(database, "Library");

const addBook = document.querySelector(".add-book");
const submitButton = document.querySelector(".submit");
const addModal = document.querySelector(".modal-add");
const bookName = document.getElementById("book-name");
const authorName = document.getElementById("author-name");
const noOfPages = document.getElementById("no-pages");
const section = document.querySelector(".books");
const checkBox = document.getElementById("read-cb");
const closeButton = document.querySelector(".close-modal");

function hideModal() {
  addModal.classList.toggle("hidden");
}
addBook.addEventListener("click", hideModal);

closeButton.addEventListener("click", hideModal);

submitButton.addEventListener("click", () => {
  let nameValue = bookName.value;
  let authorValue = authorName.value;
  let pagesValue = noOfPages.value;
  let readValue = checkBox.checked;
  let bookObject = {};
  let approved = false;
  pagesValue && nameValue && pagesValue != ""
    ? (approved = true)
    : (approved = false);
  if (approved) {
    bookObject = {
      name: nameValue,
      author: authorValue,
      pages: pagesValue,
      read: readValue,
    };
  } else {
  }
  push(booksInDatabase, bookObject);
  clearFields();
  hideModal();
});

function clearFields() {
  bookName.value = "";
  authorName.value = "";
  noOfPages.value = "";
  checkBox.value = false;
}
function clearSection() {
  section.innerHTML = "";
}
//For looping on the items on the database we pushed earlier/snapshot
onValue(booksInDatabase, function (snapshot) {
  if (snapshot.exists()) {
    clearSection();
    let booksArray = Object.entries(snapshot.val());

    for (let i = 0; i < booksArray.length; i++) {
      let currentBook = booksArray[i];
      addBooksToSection(currentBook);
    }
  } else {
    const paragraph = document.createElement("p");
    paragraph.textContent = "No Books in here..";
    section.append(paragraph);
  }
});

function addBooksToSection(book) {
  let bookKey = book[0];
  let bookValue = book[1];

  let nameOfBook = bookValue.name;
  let authorOfBook = bookValue.author;
  let bookPages = bookValue.pages;
  let hasRead = bookValue.read;

  //Creating elements so we can implement them on the web
  let divElement = document.createElement("div");
  let h4Element1 = document.createElement("h4");
  let h4Element2 = document.createElement("h4");
  let h4Element3 = document.createElement("h4");
  let readButton = document.createElement("button");
  let deleteButton = document.createElement("button");
  h4Element1.textContent = `Name: ${nameOfBook}`;
  h4Element2.textContent = `Author: ${authorOfBook}`;
  h4Element3.textContent = `Pages: ${bookPages}`;

  if (hasRead) {
    readButton.classList.toggle("green");
  } else {
    readButton.classList.toggle("red");
  }
  divElement.classList.add("flex-div");
  deleteButton.classList.add("delete-btn");
  readButton.classList.add("read-btn");
  readButton.textContent = "READ";
  deleteButton.textContent = "DELETE";
  //Appending the created elements
  divElement.append(
    h4Element1,
    h4Element2,
    h4Element3,
    readButton,
    deleteButton
  );
  //Adding styles to the read button, green for read, red for didn't read
  readButton.addEventListener("click", () => {
    if (readButton.classList.contains("green")) {
      readButton.classList.remove("green");
      readButton.classList.add("red");
    } else {
      readButton.classList.add("green");
      readButton.classList.remove("red");
    }
  });
  //Deleting the item by it's key on the database
  deleteButton.addEventListener("click", function () {
    let keyOfItem = ref(database, `Library/${bookKey}`);
    remove(keyOfItem);
  });
  //Appending the div element to the main section
  section.appendChild(divElement);
}
