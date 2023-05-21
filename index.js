console.log("index.js loaded");
const state = {
    inputValue:"makingsure state defines value",
    tasks: []
}

function main(){
    console.log("document.body has loaded");
    console.log("initial state is: ",state);
    const inputRef = document.getElementById("taskInput");
    inputRef.value = state.inputValue;
    const submitBtn = document.getElementById("submitBtn");
    inputRef.addEventListener('input',inputChangedHandler);

    const tasksContainer = document.getElementById('tasksAnchor');
    const templateRef = document.getElementsByClassName('template')[0];
    submitBtn.addEventListener('click',e=>submitBtnHandler(e,templateRef,tasksContainer));
}

const inputChangedHandler = e => {
    console.log("from inside input handler: "+e.target.value);
    state.inputValue = e.target.value;
    e.target.value = state.inputValue;
}
const submitBtnHandler = (e,taskTemplate,anchorPoint) => {
    const newTask = taskTemplate.cloneNode(true);
    const newTaskData = new Task(state.tasks.length+1,state.inputValue);
    state.tasks.push(newTaskData);

    const children = Array.from(newTask.childNodes).filter(item=>item.nodeName == "DIV");
    children[0].innerText = `TASK #${newTaskData.order}`;
    children[1].innerText = newTaskData.content;

    newTask.classList.remove('hidden');

    anchorPoint.append(newTask);
};

//For clarity
class Task{
    constructor(order,content){
        this.order = order;
        this.content = content;
    }
    swapOrder(otherTask){
        temp = this.order;
        this.order = otherTask.order;
        otherTask.order = temp;
    }
}
