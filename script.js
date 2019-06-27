
var $list, $addTaskInput, $addTaskColor;
const BASE_URL = 'http://195.181.210.249:3000/todo/';
function main() {
    prepareDOMElements();
    prepareDOMEvents();
   getTodos();
}
function getTodos() {
    /**
     * Przy pomocy axiosa, czyli klienta opartego na promisach do komunikacji z serwerami,
     * pobieramy uywając metody get wszystkie elementy z urla BASE_URL
     * funkcja axios.get zwraca nam Promise z odpowiedzią z serwera
     */
    axios.get(BASE_URL)
        /**
         * Przy uyciu konsumera then oczekujemy na odpowiedź i wykonaniu promisy utworzonej w funkcji axios.get
         * Następnie dla danych zawartych wewnątrz odpowiedzi wywołujemy funkcję prepareInitialList
         */
        .then(res => {
            prepareInitialList(res.data);
        })
        /**
         * W przypadku potencjalnego błędu po stronie serwera wyłapujemy go i wyświetlamy informacje do konsoli
         */
        .catch(err => {
            console.log('zlapalem blad w promisie');
        });
}

function prepareInitialList(elements) {
    elements.forEach(element => {
        addElementToList($list, element.title, element.color, element.id);
    });
}

function prepareDOMElements() {
    $list = document.getElementById('task-list');
    $addTaskInput = document.getElementById('add-task');
    $addTaskColor = document.getElementById('element-color');
}

function prepareDOMEvents() {
    var addButton = document.getElementById('add');
    addButton.addEventListener('click', addButtonHandler);
    $list.addEventListener('click', listClickHandler);
}

function addButtonHandler() {/**
    * przy pomocy axiosa wysylamy call "POST" z danymi nowego todosa
    */
   axios.post(BASE_URL, {
       /**
        * Wysylamy title i extra, wartosci naszego inputu z tytulem todosa oraz input z kolorem nowego todosa w polu extra
        */
       title: $addTaskInput.value,
       extra: $addTaskColor.value,
   }).then(() => {
       /**
        * Po udanej wysylce, jezeli promise zwrocony z funkcji axios.post zakonczyl sie sukcesem czyscimy cala liste i od nowa
        * pobieramy wszystkie todosy z serwera (dzieki temu pobieramy rowniez juz ten nowy utworzony todos)
        */
       $list.innerHTML = '';
       getTodos();
   })
}
   

function listClickHandler(event) {
    if(event.target.tagName != "BUTTON") {
        return;
    }
// // sprawdz jaki przycisk zstal klikniety kolejny if

    if(event.target.className === "edit") {
    editEL(event.target.dataset.taskId)
    } else if (event.target.className === "delete") {
    deleteElement(event.target.dataset.taskId);
    }
}

   

function deleteElement(elementId) {
      /**
     * za pomoca axiosa wysylamy informacje o usunieciu danego elementu robimy to poprzez utworzenie urla zlozonego z urla podstawowego
     * bedace nasz zmienna globalna oraz idka elementu do usuniecia np. wysylka axios.delete pod adres:
     * 'http://195.181.210.249:3000/todo/93' usunie z serwera element o id 93
     */
    axios.delete(BASE_URL + elementId);
    /**
     * usuwamy rowniez dany element z naszej strony, znajdujemy go za pomoca jego Idka i wywolujemy funkcje remove, 
     * ktora usunie go z drzewa DOM
     */
    document.getElementById(elementId).remove();
}

function addElementToList($listWhereAdd, title, color, id) {
    var createdElement = createListElement(title, color, id);
    $listWhereAdd.appendChild(createdElement);
}

function createListElement(title, color, id) {
 
    var newListElement = document.createElement('li');
    // newListElement.textContent= title;
    newListElement.style.color = color;
    newListElement.id = 'todo-' + id;
    var newspanelement = document.createElement('span')
    newspanelement.textContent = title;
    newListElement.appendChild(newspanelement)
   
   

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'delete';
    deleteButton.classList.add('delete');
    deleteButton.dataset.taskId = id;
    newListElement.appendChild(deleteButton);

    var editButton = document.createElement('button');
    editButton.textContent = 'edit';
    editButton.classList.add('edit');
    editButton.dataset.taskId = id;
    newListElement.appendChild(editButton);

    return newListElement;
}
function editEL(elementId){ 
    axios.put(BASE_URL + elementId, {title: 'nowy tytul'});
    document.getElementById('popup').style.display = 'block';
    var content = document.querySelector('#todo-' + elementId + ' span');
    var inputText = document.getElementById('intext').value;
    content.innerHTML = inputText;
    debugger;
   


    
    // textConteiner.innerText = content
    
    // 1 znalesc input query sesector getelementbyId
    //2 wrzucic text do inputa
    // submit to pomienic podmienia 

  
}
    function closeForm() {
    document.getElementById("popup").style.display = "none";
  }

document.addEventListener('DOMContentLoaded', main);