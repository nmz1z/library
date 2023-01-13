// load books array

// draw books in DOM based on array

// ADD:
    // open modal
    // save

// EDIT:
    // open modal w/ edit flah
    // save

// function setUpLibrary

function openModal(flag, object){
  if(flag === 'edit'){
    modalWindow.header.textContent = "EDIT"
    // load values
    modalWindow.author.value = object.author;
    modalWindow.title.value = object.title;
    modalWindow.image.value = object.image;
    modalWindow.pages.value = object.pages;
    modalWindow.validator.textContent = '';
  }else{
    modalWindow.header.textContent = "NEW BOOK"
  }
  modalWindow.body.classList.toggle('hidden');
}

function closeModal(){
  modalWindow.body.classList.toggle('hidden');
  // reset values
}

// function saveBook
function saveBook(inputs, book){
}

// add book
function addBook(){
  const book = {
    body,
    title,
    author,
    image,
    pages,
  }
  return book;
}

// function toggleRead

// function drawBookInDOM()
/*

*/

// function loadStorage
function loadLocalStorage(){
  return localStorage.getItem("library")
  ? JSON.parse(localStorage.getItem("library"))
  : [];
}

// -- OBJECTS

const modalWindow = {
  body: document.querySelector('.modal__mask'),
  title: document.getElementById('modal-title'),
  author: document.getElementById('modal-author'),
  image: document.getElementById('modal-image'),
  validator: document.getElementById('modal-validator'),
  pages: document.getElementById('modal-pages'),
  closeButton: document.getElementById('modal-close'),
  header: document.getElementById('modal-header'),
}
// -- VARS
const booksContainer = document.querySelector('.container');
const addButton = document.querySelector('.button__add-book')
// -- EVENTS
addButton.addEventListener('click', () => {openModal('add')});
modalWindow.closeButton.addEventListener('click', closeModal);

// -- INIT


// loadStorage
// setUpLibrary
