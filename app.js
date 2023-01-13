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
    modalWindow.flag === flag;
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

// add book
function addBook(config){
  const book = {
      data:
        {title,
        author,
        image,
        pages,},
      status: {
        read: false,
        current: 0,
      }
    // methods? edit, delete
  }
  // save book in storage
  addToLocalStorage(book);
  // draw book in dom
  drawBook(book);
}

/*
function editBook(config, object){
  // update
}
*/

// function toggleRead

function drawBook(book) {

const config = book.data
// .book
const bookDiv = document.createElement('div');
bookDiv.classList.add('.book');
booksContainer.appendChild(bookDiv)
  // .book__buttons-container
  const btnContainer = document.createElement('div');
  bookDiv.classList.add('.book__buttons-container');
  bookDiv.appendChild(btnContainer);
    // button.book__edit-button
    const editBtn = document.createElement('button');
    editBtn.classList.add('book__edit-button');
    btnContainer.appendChild(editBtn);
      // i.fa-solid fa-pencil
      const editIcon = document.createElement('i');
      editIcon.classList.add('fa-solid fa-pencil');
      editBtn.appendChild(editIcon);
    // button.book__remove-button
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('book__edit-button');
    btnContainer.appendChild(removeBtn);
      // fa-regular fa-circle-xmark
      const removeIcon = document.createElement('i');
      removeIcon.classList.add('fa-regular fa-circle-xmark');
      removeBtn.appendChild(removeIcon);
  // h2.book__title
  const title = document.createElement('h2');
  title.classList.add('book__title');
  title.textContent = config.title;
  bookDiv.appendChild(title);
  // h3.book__author
  const author = document.createElement('h2');
  author.classList.add('book__author');
  author.textContent = config.author;
  bookDiv.appendChild(author);
  // .book__cover
  const cover = document.createElement('')
    // img.book__cover-image
  // p.book__pages-ui
    // input.pages__read
    // span.pages__divider{of}
    // .pages__total
  // button.book__read-button

// events

}

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
  confirmButton: document.getElementById('modal-confirm'),
  // other
  mode,
  references: {
    dom,
    obj,
  }
};

// -- VARS
const booksContainer = document.querySelector('.container');
const addButton = document.querySelector('.button__add-book')
// -- EVENTS
addButton.addEventListener('click', () => {openModal('add')});
modalWindow.closeButton.addEventListener('click', closeModal);
modalWindow.confirmButton.addEventListener('click', () => {
  if(modalWindow.mode === 'edit'){
    // editBook(modalWindow.input, object);
  }else{
    addBook(modalWindow.input);
  }
});
// -- INIT


// loadStorage
// setUpLibrary
