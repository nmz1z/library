// load books array

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
    //
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
function addBook(config){
  const book = {
    data: {
      title,
      author,
      image,
      pages,
    },
    // methods? edit, delete
  }
  // save book in storage
  addToLocalStorage(book);
  // draw book in dom
  drawBook(book);
}

// function toggleRead

// function drawBook()
/*
// .book
  // .book__buttons-container
    // button.book__edit-button
      // i.fa-solid fa-pencil
    // button.book__remove-button
      // fa-regular fa-circle-xmark
  // h2.book__title
  // h3.book__author
  // .book__cover
    // img.book__cover-image


*/

// STORAGE
// function loadStorage
function loadLocalStorage(){
  return localStorage.getItem("library")
  ? JSON.parse(localStorage.getItem("library"))
  : [];
}

function addToLocalStorage(book){
  let library = loadLocalStorage();
  library.push(book);
  localStorage.setItem("library", JSON.stringify(library));
}

// -- OBJECTS

const modalWindow = {
  body: document.querySelector('.modal__mask'),
  // input
  input: {
    title: document.getElementById('modal-title'),
    author: document.getElementById('modal-author'),
    image: document.getElementById('modal-image'),
    pages: document.getElementById('modal-pages'),
  },
  // text
  validator: document.getElementById('modal-validator'),
  header: document.getElementById('modal-header'),
  // ui
  closeButton: document.getElementById('modal-close'),
  confirmButton: document.getElementById('modal-confirm')
}
// -- VARS
const booksContainer = document.querySelector('.container');
const addButton = document.querySelector('.button__add-book')
// -- EVENTS
addButton.addEventListener('click', () => {openModal('add')});
modalWindow.closeButton.addEventListener('click', closeModal);
modalWindow.confirmButton.addEventListener('click', () => {

});
// -- INIT


// loadStorage
// setUpLibrary
