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

// function toggleRead

function drawBook(book) {
  const config = book.data;
  // .book
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');
  booksContainer.appendChild(bookDiv)
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
  editIcon.classList.add('fa-pencil');
  editBtn.appendChild(editIcon);
  // button.book__remove-button
  const removeBtn = document.createElement('button');
  removeBtn.classList.add('book__edit-button');
  btnContainer.appendChild(removeBtn);
  // fa-regular fa-circle-xmark
  const removeIcon = document.createElement('i');
  removeIcon.classList.add('fa-regular');
  removeIcon.classList.add('fa-circle-xmark');
  removeBtn.appendChild(removeIcon);

  // .book__header
  const bookHeader = document.createElement('div');
  bookHeader.classList.add('book__header');
  bookDiv.appendChild(bookHeader)
  // h2.book__title
  const title = document.createElement('h3');
  title.classList.add('book__title');
  title.textContent = config.title;
  bookHeader.appendChild(title);
  // h3.book__author
  const author = document.createElement('p');
  author.classList.add('book__author');
  author.textContent = config.author;
  bookHeader.appendChild(author);

  // .book__cover
  const cover = document.createElement('div');
  cover.classList.add('book__cover');
  bookDiv.appendChild(cover);
  // img.book__cover-image
  const image = document.createElement('img');
  image.classList.add('book__cover-image')
  image.src = config.image;
  cover.appendChild(image);

  // pages header
  const pagesHeader = document.createElement('p');
  pagesHeader.classList.add('book__pages-header');
  pagesHeader.textContent = 'Pages';
  bookDiv.appendChild(pagesHeader);
  // p.book__pages-ui
  const pagesUI = document.createElement('div');
  pagesUI.classList.add('book__pages-ui');
  bookDiv.appendChild(pagesUI);
  // input.pages__read-input
  const pagesRead = document.createElement('input');
  pagesRead.value = book.status.current;
  pagesRead.type = "number";
  pagesRead.min = "0"
  pagesRead.max = book.data.pages;
  pagesRead.classList.add('pages__read-input');
  pagesUI.appendChild(pagesRead);
  // span.pages__divider{of}
  const pagesDivider = document.createElement('span');
  pagesDivider.classList.add('pages__divider');
  pagesDivider.textContent = 'of'
  pagesUI.appendChild(pagesDivider);
  // .pages__progress-total
  const pagesTotal = document.createElement('div');
  pagesTotal.classList.add('pages__progress-total');
  pagesTotal.textContent = book.data.pages;
  pagesUI.appendChild(pagesTotal);
  // button.book__read-button
  const readBtn = document.createElement('button');
  readBtn.classList.add('pages__divider');
  readBtn.textContent = 'Read'
  bookDiv.appendChild(readBtn);

  // events
  removeBtn.addEventListener('click', e => {
    e.currentTarget.parentElement.parentElement.remove();
    console.log(e.currentTarget)
    removeFromStorage(book);
  });
  editBtn.addEventListener('click', (e) => {openModal('edit', book, e);});
  pagesRead.addEventListener('change', (e) => {updateReadPages(book, e)})
}

function updateReadPages(book, e){
  let value = e.currentTarget.value;
  if(value > book.data.pages){
    value = book.data.pages;
    e.currentTarget.value = book.data.pages;
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

// storage functions
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

// Modal window
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
