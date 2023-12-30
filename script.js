const itemForm = document.getElementById('item-form'); // form
const itemInput = document.getElementById('item-input'); // input element in form
const itemList = document.getElementById('item-list'); // the ul

function addItem(e){
    e.preventDefault(); // since we dont want it to submit to the file

    const newItem = itemInput.value;
    // Validating the Input
    if (newItem.value === ''){
        alert('Please add an item');
        return;
    }
    
    // Creating list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(newItem));
    
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
   
    itemList.appendChild(li); // adding it to the DOM

    itemInput.value = ''; // clearing the input value after
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

// Event Listeners
itemForm.addEventListener('submit', addItem);