console.log("index.js loaded");
const state = {
    inputValue:"",
    tasks: [],
    submitBtnEnabled: false
}
const MANUAL = 'Manually decide task order';
const DUE_DATE ='Sort by due date';
const SOTRING_OPTIONS = {MANUAL,DUE_DATE};

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
    submitBtn.addEventListener('click',e=>submitBtnHandler(e,templateRef,tasksContainer,inputRef));
}

const resetInputValue = (inputHTMLref,subBtnHTMLref) => {
    state.inputValue="";
    inputHTMLref.value = state.inputValue;
    subBtnHTMLref.setAttribute('disabled',true);
    state.submitBtnEnabled = false;
};

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
const submitBtnHandler = (e,taskTemplate,anchorPoint,inputHTMLref) => {
    const subBtnRef = e.target;
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

    setValidBtns(newTaskData);
    if(newIndex>0){
        setValidBtns(state.tasks[newIndex-1]);
    }
    resetInputValue(inputHTMLref,subBtnRef);

    const dnbtn = buttons[1];
    dnbtn.addEventListener('click',e=>swapDn(e,newTaskData));
    const upbtn = buttons[0];
    upbtn.addEventListener('click',e=>swapUp(e,newTaskData));
};

const setValidBtns = task => {
    const {index,HTMLRef} = task;
    const buttons = HTMLRef.children[2].children;
    console.log('btns');
    console.log(buttons);
    const upbtn = buttons[0];
    const dnbtn = buttons[1];

    const { tasks } = state;
    const n = tasks.length;
    if(n==0){
        throw new Error("logic is flawed. this function should not be called if tasklist is empty");
    }
    if(n==1){//If we got around to a single task, it cannot go up or down.
        upbtn.setAttribute('disabled',true);
        dnbtn.setAttribute('disabled',true);  
        return;  
    }
    else{//If n>1
        if(index<n-1){//Means, we can go down
            dnbtn.removeAttribute('disabled');
        }
        if(index>0){//if more then one task, all the tasks bellow it can go up
            upbtn.removeAttribute('disabled');
        }
        if(index==n-1){
            dnbtn.setAttribute('disabled',true);
        }
        if(index==0){
            upbtn.setAttribute('disabled',true);
        }
    }
};

const deleteTask = (e,anchor,newTaskData) => {
    
    anchor.removeChild(newTaskData.HTMLRef);
    state.tasks.splice(newTaskData.index,1);
    //Update indexes
    const n = state.tasks.length;
    let i;
    for(i=0;i<n;i++){
        state.tasks[i].setIndex(i);
        state.tasks[i].HTMLRef.children[0].innerText = `TASK#${i+1}`;
        setValidBtns(state.tasks[i]);
    }
}

//Assumption: since btn is only clickable when valid, no need to check if task have a task below it
const swapDn = (e,task) => 
{
    const task2 = state.tasks[task.index+1];
    swapNeighbours(task,task2);
}

const swapUp = (e,task) => swapNeighbours(state.tasks[task.index-1],task);

//Assumption: task1 and task1 are indeed two neighbours that can be swapped, where task1 is the upper one
function swapNeighbours(task1,task2){
    //first, data representation swap
    const { tasks } = state;
    const index1 = task1.index;
    const index2 = task2.index;
    tasks[index1] = task2;
    tasks[index2] = task1;
    tasks[index1].setIndex(index1);
    tasks[index2].setIndex(index2);
    tasks[index1].HTMLRef.children[0].innerText = `TASK#${index1+1}`;
    tasks[index2].HTMLRef.children[0].innerText = `TASK#${index2+1}`;


    //second, HTML elements swap
    const parent = task2.HTMLRef.parentNode;
    parent.insertBefore(task2.HTMLRef,task1.HTMLRef);
    setValidBtns(task1);
    setValidBtns(task2);
}

// const renderTasks = anchorPoint => {
//     const { tasks } = state;
//     const taskNodeList = tasks.map(task=>createHTMLtaskElement(task));
//     taskNodeList.forEach(element => {
//         anchorPoint.appendChild(element);
//     });
// };

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
    setIndex(newVal){
        this.index = newVal;
    }
}
