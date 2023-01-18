function setupLibrary(){
  const library = loadLocalStorage();
  if(library.length > 0){
    library.forEach(book => drawBook(book));
  }
}

function openModal(flag, object, e){
  modalWindow.mode = flag;
  if(modalWindow.mode === 'edit'){
    const storage = loadLocalStorage();
    const book = storage.find(item => item.id === object.id);
    modalWindow.ref.obj = book;
    modalWindow.ref.dom = e.currentTarget.parentElement.parentElement;
    // load values
    for (let key in modalWindow.input) {
      modalWindow.input[key].value = book.data[key];
    }
    // ui
    modalWindow.header.textContent = "EDIT"
  }else{
    modalWindow.header.textContent = "NEW BOOK"
  }
  modalWindow.body.classList.toggle('hidden');
}

function closeModal(){
  modalWindow.body.classList.toggle('hidden');
  // reset values
  for (let key in modalWindow.input) {
    modalWindow.input[key].value = '';
  }
}

function addBook(config){
  if(!authenticate()){
    return;
  }
  const book = {
      data:{
        title: config.title.value,
        author: config.author.value,
        image: config.image.value,
        pages: config.pages.value,
      },
      status: {
        read: false,
        current: 0,
      },
      id: new Date().getTime().toString(),
  }
  addToLocalStorage(book);
  drawBook(book);
  closeModal();
}

function editBook(){
  const object = modalWindow.ref.obj;
  let domElement = modalWindow.ref.dom;

  // update DOM
  domElement.querySelector('.book__title').textContent = modalWindow.input.title.value;
  domElement.querySelector('.book__author').textContent = modalWindow.input.author.value;
  domElement.querySelector('.book__cover-image').src = modalWindow.input.image.value;
  domElement.querySelector('.pages__progress-total').textContent = modalWindow.input.pages.value;
  domElement.querySelector('.pages__read-input').max = modalWindow.input.pages.value;

  // update object in localStorage
  const storage = loadLocalStorage();
  let library = storage.map(function (item){
    if (item.id === object.id){
        item.data.title = modalWindow.input.title.value;
        item.data.author = modalWindow.input.author.value;
        item.data.image = modalWindow.input.image.value;
        item.data.pages = modalWindow.input.pages.value;
      }
      return item;
    });
  localStorage.setItem("library", JSON.stringify(library));
  closeModal();
}

// function Auth
function authenticate(){
  let auth = true;
  for (const key in modalWindow.input) {
    if(key === 'image') continue;
    if(!modalWindow.input[key].value){
      modalWindow.input[key].style.backgroundColor = 'red';
      auth = false;
    }else{
      modalWindow.input[key].style.backgroundColor = 'white'
    }
  }
  return auth;
}

function setUpElement(type, className, parent){
  const element = document.createElement(type);
  element.className = className;
  parent.appendChild(element);
  return element;
}

//
function drawBook(book) {
  const config = book.data;
  // .book
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');
  booksContainer.appendChild(bookDiv);
  // .page[n] + .back-cover
  const page1 = document.createElement('div');
  page1.classList.add('page1');
  bookDiv.appendChild(page1);
  const page2 = document.createElement('div');
  page2.classList.add('page2');
  bookDiv.appendChild(page2);
  const page3 = document.createElement('div');
  page3.classList.add('page3');
  bookDiv.appendChild(page3);
  const backCover = document.createElement('div');
  backCover.classList.add('back-cover');
  bookDiv.appendChild(backCover);
  // .book__buttons-container
  const btnContainer = document.createElement('div');
  btnContainer.classList.add('book__buttons-container');
  bookDiv.appendChild(btnContainer);
  // button.book__edit-button
  const editBtn = document.createElement('button');
  editBtn.classList.add('book__edit-button');
  btnContainer.appendChild(editBtn);
  // i.fa-solid fa-pencil
  const editIcon = document.createElement('i');
  editIcon.classList.add('fa-solid');
  editIcon.classList.add('fa-pen');
  editBtn.appendChild(editIcon);
  // button.book__remove-button
  const removeBtn = document.createElement('button');
  removeBtn.classList.add('book__delete-button');
  btnContainer.appendChild(removeBtn);
  // fa-regular fa-circle-xmark
  const removeIcon = document.createElement('i');
  removeIcon.classList.add('fa-solid');
  removeIcon.classList.add('fa-trash');
  removeBtn.appendChild(removeIcon);
  // .book__header
  const bookHeader = document.createElement('div');
  bookHeader.classList.add('book__header');
  bookDiv.appendChild(bookHeader)
  // h2.book__title
  const title = document.createElement('h3');
  title.classList.add('book__title');
  bookHeader.appendChild(title);
  title.textContent = config.title;
  // h3.book__author
  const author = document.createElement('p');
  author.classList.add('book__author');
  bookHeader.appendChild(author);
  author.textContent = config.author;
  // .book__cover
  const cover = document.createElement('div');
  cover.classList.add('book__cover');
  bookDiv.appendChild(cover);
  // img.book__cover-image
  const image = document.createElement('img');
  image.classList.add('book__cover-image')
  image.src = config.image;
  cover.appendChild(image);
  // p.book__pages-ui
  const pagesUI = setUpElement('div', 'book__pages-ui', bookDiv);
  // pages header
  const readText = document.createElement('p');
  readText.classList.add('book__pages-read');
  readText.textContent = 'Read:';
  pagesUI.appendChild(readText);
  // .pages__read
  const pagesRead =  setUpElement('div', 'pages__read', pagesUI);
  // .pages-read__minus-btn
  const minusBtn = setUpElement('button', 'pages-read__minus-btn', pagesRead);
  // .fa-solid fa-minus
  const minusIcon = setUpElement('i', 'fa-solid fa-minus', minusBtn);
  // input.pages__read-input
  const readInput = setUpElement('input', 'pages__read-input', pagesRead);
  readInput.value = book.status.current;
  readInput.type = "number";
  readInput.min = "0"
  readInput.max = book.data.pages;
  // .pages-read__plus-btn
  const plusBtn = setUpElement('button', 'pages-read__plus-btn', pagesRead);
  // .fa-solid fa-plus
  const plusIcon = setUpElement('i', 'fa-solid fa-plus', plusBtn);
  // .pages__progress (@pagesUI)
  const pagesProgress = setUpElement('div', 'pages__progress', pagesUI);
  // .pages__progress-read
  const progressRead = setUpElement('div', 'pages__progress-read', pagesProgress);
  progressRead.textContent = 0;
  // .pages__progress-bar
  const barContainer = setUpElement('div', 'pages__progress-bar', pagesProgress);
  //
  const barProgress = setUpElement('div', 'progress-bar__progress', barContainer);
  // .pages__progress-total
  const progressTotal = setUpElement('div', 'pages__progress-total', pagesProgress);
  progressTotal.textContent = config.pages;
  // .pages__progress-status (@pagesUI)
  const status = setUpElement('div', 'pages__progress-status', pagesUI);
  status.textContent = 'Plan to read'
  // events
  removeBtn.addEventListener('click', e => {
    e.currentTarget.parentElement.parentElement.remove();
    console.log(e.currentTarget)
    removeFromStorage(book);
  });
  editBtn.addEventListener('click', (e) => {openModal('edit', book, e);});
  readInput.addEventListener('change', (e) => {updateReadPages(book, e.currentTarget)});
  plusBtn.addEventListener('click', () => {
    readInput.value = +readInput.value + 1;
    updateReadPages(book, readInput);
  });
  minusBtn.addEventListener('click', () => {
    readInput.value = +readInput.value - 1;
    updateReadPages(book, readInput);
  });
  // minusBtn.addEventListener();
}

function updateReadPages(book, target){
  let value = target.value;
  if(+value > book.data.pages){
    value = book.data.pages;
    target.value = book.data.pages;
  }
  if(+value <= 0){
    value = 0;
    target.value = 0;
  }
  let storage = loadLocalStorage().map(
    element => {
      if(element.id === book.id){
        element.status.current = value;
      }
      return element;
    }
  );
  localStorage.setItem("library", JSON.stringify(storage));
}

// > Storage Functions
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

function removeFromStorage(book){
  let library = loadLocalStorage();
  console.log(book.id);
  const storage = library.filter(
    element => book.id !== element.id
  );
  localStorage.setItem("library", JSON.stringify(storage));
}

// > Modal window
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
  header: document.getElementById('modal-header'),
  // buttons
  closeButton: document.getElementById('modal-close'),
  confirmButton: document.getElementById('modal-confirm'),
  // other
  mode: '',
  ref: {
    dom: null,
    obj: null,
  }
};

function addSample(array){

}

// vars
const booksContainer = document.querySelector('.container');
const addButton = document.querySelector('.button__add-book');

// events
addButton.addEventListener('click', () => {openModal('add')});
modalWindow.closeButton.addEventListener('click', closeModal);
modalWindow.confirmButton.addEventListener('click', (e) => {
  if(modalWindow.mode === 'edit'){
    editBook();
  }else{
    addBook(modalWindow.input);
  }
});

// sample

// const sample = [
//   {
//       data:{
//         title: config.title.value,
//         author: config.author.value,
//         image: config.image.value,
//         pages: config.pages.value,
//       },
//       status: {
//         read: false,
//         current: 0,
//       },
//       id: 0x1,
//   },
// ]

// init
setupLibrary();
if(!localStorage.getItem('accessed')){
  addSample(sample);
  localStorage.setItem('accessed', true);
};
