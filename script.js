const itemForm = document.getElementById('item-form'); // form
const itemInput = document.getElementById('item-input'); // input element in form
const itemList = document.getElementById('item-list'); // the ul
const clearButton = document.getElementById('clear');
const itemFilter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUl();
}
function onAddItemSubmit(e){
    e.preventDefault(); // since we dont want it to submit to the file

    const newItem = itemInput.value; // getting the value of the item input
    // Validating the Input
    if (newItem === ''){
        alert('Please add an item');
        return;
    }
    // Check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode'); // getting the list items and selecting the item list with .edit-mode class
        
        removeItemFromStorage(itemToEdit.textContent); // sending the text content instead of the actual li tag
        itemToEdit.classList.remove('.edit-mode'); // removing the class list
        itemToEdit.remove(); // removing it from DOM
        isEditMode = false;
    } else{
        if(checkIfItemExists(newItem)){
            alert('That item already exists!');
            return;
        }
    }
    // Creating item DOM element
    addItemToDOM(newItem);
    // Adding the item to local storage
    addItemToStorage(newItem)
    // checking the ul list after adding an item
    checkUl(); 
    itemInput.value = ''; // clearing the input value after
}

function addItemToDOM(item){
    // Creating list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    // adding li to the DOM
    itemList.appendChild(li); 
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes; // setting class to the classes we got in argument
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage(); // represents the array of items in local storage

    // Adding the new item to array
    itemsFromStorage.push(item);
    // Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else { // if there is we're gonna parse it to have an array of whatevers in storage
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-item')){// checking if the button is clicked on by checking the classname on it
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage(); // an array
    return itemsFromStorage.includes(item); // you can use includes on an array

}

function setItemToEdit(item){
    isEditMode = true;

    itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode')); // reset the li list edit mode everytime the function is called

    item.classList.add('edit-mode');
    // replacing the form button innerHTML to the updated version
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function removeItem(item) {
    if(confirm('Are you sure?')){  // using the confirm function on the window object
        // remove item from DOM
        item.remove();

        // remove item from local storage
        removeItemFromStorage(item.textContent);

        checkUl();
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();
    
    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item); // filter, returns a new array with the item that we wanted to remove not in it

    // Re-set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
    // method 1:
    // itemList.innerHTML = '';

    // method 2:
    if(confirm('Are you sure?')){
    while (itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }
    // clear from local storage
    localStorage.removeItem('items'); // passing the key 'items'
}
    checkUl();
}

function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase(); //gives us the element that the event listener is on (input)

    items.forEach((item)=> {
        const itemName = item.firstChild.textContent.toLocaleLowerCase();
        
        // if the text that's typed in matches the item name
        if(itemName.indexOf(text) != -1) { // checking it this way, because indexOf returns -1 or true
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// a function to check the Ul and see if there's any list items in it
function checkUl(){
    itemInput.value = '';
    // adding this here, so we can check the list items, everytime the function runs
    const items = itemList.querySelectorAll('li'); //qs all gives u a node list, like an array

    if (items.length === 0) {
        clearButton.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearButton.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    formBtn.innerHTML = '<i class ="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false; // reseting the isEditMode
}
// Initialize App
function init(){
// Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearButton.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems());
// running this function in global scope as soon as the page loads
checkUl(); 
}

init();