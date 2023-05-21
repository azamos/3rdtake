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
    submitBtn.addEventListener('click',submitBtnHandler);
}

const inputChangedHandler = e => {
    console.log("from inside input handler: "+e.target.value);
    state.inputValue = e.target.value;
    e.target.value = state.inputValue;
}
const submitBtnHandler = e => console.log(state);

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
