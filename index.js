console.log("Script index chargé !")

//localStorage.setItem('list',JSON.stringify([{label:"carottes",done:false},{label:"Lessive",done:true}]))

const formElement = document.getElementById('add-shopping-item')
const shoppingItemTemplate = document.getElementById('shopping-list-item')
const emptyListAlertTemplate = document.getElementById('empty-list-alert')
const shoppingList = document.getElementById("shopping-list")

checkEmptyness()
loadShoppingList()

formElement.addEventListener('submit',event=>{
    const data = new FormData(event.currentTarget)
    const label = data.get('shopping-item-label')

    event.preventDefault()
    addItem({id:randomId(), label:label,done:false},true)
    formElement.querySelector('input').value = ""
})


function loadShoppingList(){
    const list = getDataFromStorage()

    for(let item of list){
        addItem({id:item.id, label:item.label,done:item.done},false)
    }
}

function addItem(item,persist){

    let data = getDataFromStorage();
    if(persist){
        data.push(item);
        addDataToStorage(data)
    }

    let itemElement = shoppingItemTemplate.content.cloneNode(true)
    itemElement.querySelector('li').setAttribute('data-id',item.id)
    itemElement.querySelector('input').checked = item.done
    itemElement.querySelector('.ms-2.form-check-label').textContent = item.label

    itemElement.querySelector('.remove-btn').addEventListener('click',event=>{
        remove(event.currentTarget.parentElement)
    })

    itemElement.querySelector('input').addEventListener('change',event=>{
        console.log(event.currentTarget.parentElement)
        changeStatus(event.currentTarget.parentElement)
    })

    shoppingList.prepend(itemElement)
    checkEmptyness()
}

function remove(item){
    let data = getDataFromStorage();
    const array = data.filter(data=>data.id !== item.dataset.id)

    addDataToStorage(array)
    item.remove()
    checkEmptyness()
}

function changeStatus(item){
    let data = getDataFromStorage();
    data.map(element=>{
        if(element.id === item.dataset.id){
            element.done = !element.done
        }
        return element
    })
    addDataToStorage(data)
}

function randomId(length = 6) {
    return Math.random().toString(36).substring(2, length+2);
}

function checkEmptyness(){
    let data = getDataFromStorage();
    if(data.length === 0){
        shoppingList.append(emptyListAlertTemplate.content.cloneNode(true))
    }

    if(data.length > 0 && document.querySelector('.alert.alert-danger')){
        document.querySelector('.alert.alert-danger').remove()
    }

}

function getDataFromStorage(){
    return  localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []
}

function addDataToStorage(data){
    localStorage.setItem('list',JSON.stringify(data))
}