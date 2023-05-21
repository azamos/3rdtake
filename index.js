console.log("index.js loaded");
const state = {
    inputValue:"",
    tasks: [],
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
    const newIndex = state.tasks.length;
    const {children} = newTask;
    const id = `TASK#${newIndex+1}`;
    const newTaskData = new Task(newIndex,id,state.inputValue);
    children[0].innerText = newTaskData.id;
    children[1].innerText = newTaskData.content;

    const buttons = children[2].children;
    const deleteBtn = buttons[2];

    newTask.classList.remove('hidden');
    newTask.setAttribute('id',newTaskData.id);
    anchorPoint.append(newTask);

    newTaskData.setHTMLRef(newTask);
    
    deleteBtn.addEventListener('click',e=>deleteTask(e,anchorPoint,newTaskData))
    state.tasks.push(newTaskData);

    const upBtn = buttons[0];
    const dnBtn = buttons[1];
    if(newIndex==0){
        upBtn.setAttribute('disabled',true);
    }
    if(newIndex>0){
        console.log(state.tasks[newIndex-1].HTMLRef.children[2].children[1]);
        state.tasks[newIndex-1].HTMLRef.children[2].children[1].removeAttribute('disabled');
    }
};

const deleteTask = (e,anchor,newTaskData) => {
    
    anchor.removeChild(newTaskData.HTMLRef);
    state.tasks.splice(newTaskData.index,1);
}

//For clarity
class Task{
    constructor(index,id,content){
        this.index = index;
        this.id = id;
        this.content = content;
        this.HTMLRef = null;
    }
    setHTMLRef(val){
        this.HTMLRef = val;
    }
}
