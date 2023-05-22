
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
    const inputRef = document.getElementById("taskInput");
    inputRef.value = state.inputValue;
    const submitBtn = document.getElementById("submitBtn");
    inputRef.addEventListener('input',e=>inputChangedHandler(e,submitBtn));
    const tasksContainer = document.getElementById('tasksAnchor');
    submitBtn.addEventListener('click',e=>submitBtnHandler(e,tasksContainer,inputRef));
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

const generateTaskHTML = (anchorPoint,taskData) => {//Pure HTML structure. Logic elsewhere
    const {index,content,id} = taskData;

    const taskDiv = document.createElement('div');
    taskDiv.setAttribute('class','grid-container grid-item');

    const titleDiv = document.createElement('div');
    titleDiv.setAttribute('class','title');
    const titleSpan = document.createElement('span');
    titleSpan.innerHTML=`TASK#${index+1}`;
    titleDiv.appendChild(titleSpan);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class',"delete-btn transparent xxl-font setright")
    deleteBtn.addEventListener('click',e=>deleteTask(e,anchorPoint,taskData))
    deleteBtn.innerHTML="&#10060;";
    
    titleDiv.appendChild(deleteBtn);
    taskDiv.appendChild(titleDiv);

    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('class',"content");
    contentDiv.innerHTML = `Description: ${content}`;

    taskDiv.appendChild(contentDiv);

    const navigationBtnsDiv = document.createElement('div');
    const upBtn = document.createElement('button');
    upBtn.innerHTML = "Up &#128316;";
    const dnBtn = document.createElement('button');
    dnBtn.innerHTML = "Dn &#128317;";
    upBtn.setAttribute('class',"switchbtn transparent xxl-font");
    dnBtn.setAttribute('class',"switchbtn transparent xxl-font");
    upBtn.addEventListener('click',e=>swapUp(e,taskData));
    dnBtn.addEventListener('click',e=>swapDn(e,taskData))

    navigationBtnsDiv.appendChild(upBtn);
    navigationBtnsDiv.appendChild(dnBtn);

    taskDiv.appendChild(navigationBtnsDiv);
    taskDiv.setAttribute('id',id);

    return taskDiv;
};

const submitBtnHandler = (e,anchorPoint,inputHTMLref) => {
    const subBtnRef = e.target;
    const newIndex = state.tasks.length;
    const id = `TASK#${newIndex+1}`;
    const newTaskData = new Task(newIndex,id,state.inputValue);

    //here we connect the newTask to the htmlpage
    const taskHTML = generateTaskHTML(anchorPoint,newTaskData);
    anchorPoint.append(taskHTML);
    newTaskData.setHTMLRef(taskHTML);//Consider removing this?    
    state.tasks.push(newTaskData)//updating state;

    //setting which nav btns are are enabled.The delet btn is always enabled
    setValidBtns(newTaskData);
    if(newIndex>0){
        setValidBtns(state.tasks[newIndex-1]);
    }
    resetInputValue(inputHTMLref,subBtnRef);
};

const setValidBtns = task => {
    const {index,HTMLRef} = task;
    const buttons = HTMLRef.children[2].children;
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
        state.tasks[i].HTMLRef.children[0].children[0].innerText = `TASK#${i+1}`;
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
    tasks[index1].HTMLRef.children[0].children[0].innerText = `TASK#${index1+1}`;
    tasks[index2].HTMLRef.children[0].children[0].innerText = `TASK#${index2+1}`;


    //second, HTML elements swap
    const parent = task2.HTMLRef.parentNode;
    parent.insertBefore(task2.HTMLRef,task1.HTMLRef);
    setValidBtns(task1);
    setValidBtns(task2);
}

//To give structure to the Task data, for ease of understanding
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
