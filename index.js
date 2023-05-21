console.log("index.js loaded");
const state = {
    inputValue:"",
    tasks: {},
    submitBtnEnabled: false
}

const subBtnStateNeedsToChange = () => {
    const {inputValue,submitBtnEnabled} = state;
    return (inputValue.trim()==''&&submitBtnEnabled)
        || (inputValue.trim()!=''&& !submitBtnEnabled); 
}


function main(){
    console.log("document.body has loaded");
    console.log("initial state is: ",state);
    const inputRef = document.getElementById("taskInput");
    inputRef.value = state.inputValue;
    const submitBtn = document.getElementById("submitBtn");
    
    inputRef.addEventListener('input',e=>inputChangedHandler(e,submitBtn));

    const tasksContainer = document.getElementById('tasksAnchor');
    const templateRef = document.getElementsByClassName('template')[0];
    submitBtn.addEventListener('click',e=>submitBtnHandler(e,templateRef,tasksContainer));
}

const inputChangedHandler = (e,btn) => {
    const newValue =  e.target.value;
    state.inputValue = newValue;
    e.target.value = state.inputValue;
    if(subBtnStateNeedsToChange()){
        state.submitBtnEnabled = !state.submitBtnEnabled;
        if(state.submitBtnEnabled){
            btn.removeAttribute('disabled');
        }
        else{
            btn.setAttribute('disabled',true);
        }
    }
}
const submitBtnHandler = (e,taskTemplate,anchorPoint) => {
    const newTask = taskTemplate.cloneNode(true);

    const {children} = newTask;
    const id = `TASK#${Object.keys(state.tasks).length+1}`;
    const newTaskData = new Task(id,state.inputValue);
    children[0].innerText = newTaskData.id;
    children[1].innerText = newTaskData.content;

    const buttons = children[2].children;
    const deleteBtn = buttons[2];

    newTask.classList.remove('hidden');
    newTask.setAttribute('id',newTaskData.id);
    anchorPoint.append(newTask);
    deleteBtn.addEventListener('click',e=>deleteTask(e,anchorPoint,newTask))
    state.tasks[`${newTaskData.id}`] = newTaskData;
};

const deleteTask = (e,anchor,taskHTMLRef) => {
    
    anchor.removeChild(taskHTMLRef);
    console.log('before state change: ');
    console.log(state.tasks);
    delete(state.tasks[taskHTMLRef.id]);
    console.log('after state change');
    console.log(state.tasks);
}

//For clarity
class Task{
    constructor(id,content){
        this.id = id;
        this.content = content;
    }
    setId(newId){
        this.id = newId;
    }
    swapOrder(otherTask){
        temp = this.order;
        this.order = otherTask.order;
        otherTask.order = temp;
    }
}
