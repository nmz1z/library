// variables
const modalWindow = {
  mode: '',  // flag: 'edit' / 'add'
  input: {
    title: document.getElementById('modal-title'),
    author: document.getElementById('modal-author'),
    image: document.getElementById('modal-image'),
    pages: document.getElementById('modal-pages'),
  },
  body: document.querySelector('.modal__mask'),
  header: document.getElementById('modal-header'),
  closeButton: document.getElementById('modal-close'),
  confirmButton: document.getElementById('modal-confirm'),
  ref: {
    dom: null,
    obj: null,
  }
};

let filters = ['All'];
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
const filterButtons = document.querySelectorAll('.filter');
for (const item of filterButtons) {
  item.addEventListener('click', handleFilterClick);
}

// INIT
if(!localStorage.getItem('accessed')){
  addSample(sample);
  localStorage.setItem('accessed', true);
};
setupLibrary();


// FUNCTIONS

function setupLibrary(){
  const library = loadLocalStorage();
  if(library.length > 0){
    library.forEach(book => drawBook(book));
  }
}

// FILTER methods
function handleFilterClick(event){
  const filter = event.currentTarget.textContent;
  if(filter == 'All'){
    toggleAll(event.currentTarget);
  }else{
    toggleFilter(event.currentTarget);
  }
  if(filters.length > 2 || filters.length === 0){
    const allBtn = event.currentTarget.parentElement.querySelector('.all');
    toggleAll(allBtn);
  }
  redrawLibrary();
}

function toggleAll(target){
  if(filters.includes('All')){
    return;
  }
  filters = ['All'];
  const buttons = target.parentElement.querySelectorAll('.filter');
  for (const item of buttons){
    item.classList.add('unselected');
  }
  target.classList.remove('unselected');
}

function toggleFilter(target){
  filters = filters.filter(item => item !== 'All');
  target.parentElement.querySelector('.all').classList.add('unselected');

  const filter = target.textContent;
  target.classList.toggle('unselected');

  if(filters.includes(filter)){
    filters = filters.filter(item => item !== filter);
  }else{
    filters.push(filter);
  }
}

function redrawLibrary(){
  booksContainer.innerHTML = '';
  const library = loadLocalStorage();
  let drawArray = [];

  if(filters.includes('All')){
    setupLibrary();
    return;
  }

  for (const filter of filters) {
    const filteredArray = library.filter(
      item => item.status.current === filter
    );
    drawArray = drawArray.concat(filteredArray);
  }
  drawArray.forEach(book => drawBook(book));
}

// MODAL WINDOW methods
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
    modalWindow.header.textContent = "EDIT"
  }else{
    modalWindow.header.textContent = "NEW BOOK"
  }
  modalWindow.body.classList.toggle('hidden');
}

function closeModal(){
  modalWindow.body.classList.toggle('hidden');
  modalWindow.body.querySelector('.modal__warning').classList.add('hidden');
  // reset values
  for (let key in modalWindow.input) {
    modalWindow.input[key].value = '';
    modalWindow.input[key].style.borderColor = 'gray';
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
        current: 'Not started',
        pages: 0,
      },
      id: new Date().getTime().toString(),
  }
  addToLocalStorage(book);
  drawBook(book);
  closeModal();
}

function editBook(){
  if(!authenticate()){
    return;
  }
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

function authenticate(){
  let auth = true;
  for (const key in modalWindow.input) {
    if(key === 'image') continue;
    if(!modalWindow.input[key].value){
      modalWindow.input[key].style.borderColor = 'rgb(180, 0, 0)';
      auth = false;
    }else{
      modalWindow.input[key].style.borderColor = 'grey'
    }
  }
  if(!auth){
    modalWindow.body.querySelector('.modal__warning').classList.remove('hidden');
  }
  return auth;
}

// 'DRAW' FUNCTION (long af D:)
function setUpElement(type, className, parent){
  const element = document.createElement(type);
  element.className = className;
  parent.appendChild(element);
  return element;
}

function drawBook(book) {
  const config = book.data;

  // book
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');
  booksContainer.appendChild(bookDiv);

  // decoration (Pages + Back Cover)
  const page1 = setUpElement('div', 'page1', bookDiv);
  const page2 = setUpElement('div', 'page2', bookDiv);
  const page3 = setUpElement('div', 'page3', bookDiv);
  const backCover = setUpElement('div', 'back-cover', bookDiv);

  // buttons
  const btnContainer = setUpElement('div', 'book__buttons-container', bookDiv);

  const editBtn = setUpElement('button', 'book__edit-button', btnContainer);
  const editIcon = setUpElement('i', 'fa-solid fa-pen', editBtn);

  const removeBtn = setUpElement('button', 'book__delete-button', btnContainer);
  const removeIcon =   setUpElement('i', 'fa-solid fa-trash', removeBtn);

  // book Header
  const bookHeader =  setUpElement('div', 'book__header', bookDiv);
  
  const title = setUpElement('h3', 'book__title', bookHeader);
  title.textContent = config.title;

  const author = setUpElement('p', 'book__author', bookHeader);
  author.textContent = config.author;

  // cover
  const cover = setUpElement('div', 'book__cover', bookDiv);
  const image = setUpElement('img', 'book__cover-image', cover);
  image.src = config.image;

  // UI
  const pagesUI = setUpElement('div', 'book__pages-ui', bookDiv);
  // input
  const readText =  setUpElement('p', 'book__pages-read', pagesUI);
  readText.textContent = 'Read:';

  const pagesRead =  setUpElement('div', 'pages__read', pagesUI);

  const minusBtn = setUpElement('button', 'pages-read__minus-btn', pagesRead);
  const minusIcon = setUpElement('i', 'fa-solid fa-minus', minusBtn);

  const readInput = setUpElement('input', 'pages__read-input', pagesRead);
  readInput.value = book.status.pages;
  readInput.type = "number";
  readInput.min = "0"
  readInput.max = book.data.pages;

  const plusBtn = setUpElement('button', 'pages-read__plus-btn', pagesRead);
  const plusIcon = setUpElement('i', 'fa-solid fa-plus', plusBtn);

  // progress section
  const pagesProgress = setUpElement('div', 'pages__progress', pagesUI);

  const progressRead = setUpElement('div', 'pages__progress-read', pagesProgress);
  progressRead.textContent = book.status.pages;
  
  const barContainer = setUpElement('div', 'pages__progress-bar', pagesProgress);
  const barProgress = setUpElement('div', 'progress-bar__progress', barContainer);
  barProgress.style.width = `${100*book.status.pages/book.data.pages}%`;

  const progressTotal = setUpElement('div', 'pages__progress-total', pagesProgress);
  progressTotal.textContent = config.pages;

  const status = setUpElement('div', 'pages__progress-status', pagesUI);
  if(+book.status.pages === 0){
    status.textContent = 'Not started';
    status.style.color = 'red';
  }else if(+book.status.pages >= +book.data.pages){
    status.textContent = 'Finished';
    status.style.color = 'green';
  }else{
    status.textContent = 'In progress';
    status.style.color = 'goldenrod';
  }

  // book events
  removeBtn.addEventListener('click', e => {
    e.currentTarget.parentElement.parentElement.remove();
    removeFromStorage(book);
  });

  editBtn.addEventListener('click', (e) => {openModal('edit', book, e);});

  readInput.addEventListener('paste', (e) =>{
    let pasteData = e.clipboardData.getData('text');
    if(pasteData){pasteData.replace(/[^0-9]*/g,'');}
  });
  readInput.addEventListener('keydown', (e) => {
    if(e.key==='.' || e.key==='+' || e.key === '-'){e.preventDefault();}
  });
  readInput.addEventListener('change', (e) => {updateReadPages(book, e.currentTarget)});

  plusBtn.addEventListener('click', () => {
    readInput.value = +readInput.value + 1;
    updateReadPages(book, readInput);
  });

  minusBtn.addEventListener('click', () => {
    readInput.value = +readInput.value - 1;
    updateReadPages(book, readInput);
  });
}

// USER INPUT related methods
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
        element.status.pages = value;
      }
      return element;
    }
  );
  localStorage.setItem("library", JSON.stringify(storage));

  updtadeProgressBar(target, +value, book.data.pages);
  updateStatus(target, +value, book);
  updatePagesNumber(target, +value);
}

function updatePagesNumber(target, value){
  const ui = target.parentElement.parentElement;
  const number = ui.querySelector('.pages__progress-read');
  number.textContent = value;
}

function updtadeProgressBar(target, current, total){
  const ui = target.parentElement.parentElement;
  const bar = ui.querySelector('.progress-bar__progress');
  const progress = +(current/total) * 100
  bar.style.width = `${progress}%`;
}

function updateStatus(target, current, book){
  const status = target.parentElement.parentElement.querySelector('.pages__progress-status');
  if(current === 0){
    status.textContent = 'Not started';
    status.style.color = 'red';
  }else if(current >= book.data.pages){
    status.textContent = 'Finished';
    status.style.color = 'green';
  }else{
    status.textContent = 'In progress';
    status.style.color = 'goldenrod';
  }

  let storage = loadLocalStorage()
    .map(element => {
        if(element.id === book.id){
          element.status.current = status.textContent;
        }
        return element;
    });
  localStorage.setItem("library", JSON.stringify(storage));
}


//  STORAGE methods
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
  const storage = library.filter(
    element => book.id !== element.id
  );
  localStorage.setItem("library", JSON.stringify(storage));
}

function addSample(){
  let library = loadLocalStorage();
  library = [...sample];
  localStorage.setItem("library", JSON.stringify(library));
}