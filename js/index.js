// setting up variables
let theInput = document.querySelector(".add-task input");
let theAddButton = document.querySelector(".add-task .plus");
let tasksContainer = document.querySelector(".tasks-content");
let tasksCount = document.querySelector(".tasks-count span");
let tasksCompleted = document.querySelector(".tasks-completed span");
let noTasksMsg = document.querySelector(".no-tasks-message");

let allTasks = [];

// Focus on input field
window.onload = function () {
  theInput.focus();
  if (localStorage.getItem("tasks")) {
    allTasks = JSON.parse(localStorage.getItem("tasks"));
    allTasks.forEach((task) => {
      createSpanTask(task.title, task.status == "completed" ? true : false);
    });
    noTasksMsg.remove();
  }

  calculateTasks();
};

// Adding the task
theAddButton.onclick = function () {
  if (theInput.value === "") {
    Swal.fire({
      title: "Waring!",
      text: "You added an empty text",
      icon: "warning",
      confirmButtonText: "OK",
    });
  } else {
    // check if noTaskSpan exist
    if (document.body.contains(document.querySelector(".no-tasks-message"))) {
      noTasksMsg.remove();
    }

    allTasks.push({ title: theInput.value, status: "pending" });
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    createSpanTask(theInput.value);

    Swal.fire({
      title: "Done!",
      text: "Task Added Successfully",
      icon: "success",
      showConfirmButton: false,
    });
    // save in tasks Array

    // empty the input
    theInput.value = "";

    // calculate tasks
    calculateTasks();
  }
};

document.addEventListener("click", function (e) {
  // remove current task
  if (e.target.className == "delete") {
    e.target.parentNode.remove();
    // rewrite allTasks array
    allTasks = allTasks.filter(
      (ele) =>
        ele.title !==
        e.target.parentNode.textContent.toString().replace("Delete", "")
    );

    if (!allTasks.length) {
      createNoTask();
      localStorage.removeItem("tasks");
    } else {
      localStorage.setItem("tasks", JSON.stringify(allTasks));
    }

    Swal.fire({
      title: "Deleted!",
      text: "Task Deleted Successfully",
      icon: "success",
      showConfirmButton: false,
    });
  }
  // toggle class  'finished'
  if (e.target.classList.contains("task-box")) {
    e.target.classList.toggle("finished");
    allTasks = allTasks.map((ele) => {
      console.log(e.target.textContent.replace("Delete", ""));
      if (ele.title === e.target.textContent.toString().replace("Delete", "")) {
        if (e.target.classList.contains("finished")) {
          ele.status = "completed";
          Swal.fire({
            title: "Good Job!",
            text: "Task is Done",
            icon: "success",
            showConfirmButton: false,
          });
        } else {
          ele.status = "pending";
        }
      }

      return ele;
    });
    // console.log(allTasks);
    localStorage.setItem("tasks", JSON.stringify(allTasks));
  }
  calculateTasks();
});

//  function to create no task message

function createNoTask() {
  // create messsage span element
  let msgSpan = document.createElement("span");
  // create the text message
  let msgText = document.createTextNode("No Tasks To Show");
  // add text to MsgSpan
  msgSpan.appendChild(msgText);
  // add class to MsgSpan
  msgSpan.className = "no-tasks-message";
  // Append The Message Span Element To The Task Container
  tasksContainer.appendChild(msgSpan);
}

// Function to create Task Span

function createSpanTask(task, state = false) {
  // create Span Element
  let mainSpan = document.createElement("span");
  // create Delete button
  let deleteButton = document.createElement("span");

  // create text to span
  let text = document.createTextNode(task);
  // create text to delete button
  let deleteText = document.createTextNode("Delete");
  // add text to mainSpan
  mainSpan.appendChild(text);
  // add class to mainSpan
  mainSpan.className = "task-box";
  // add delete text to delete button
  deleteButton.appendChild(deleteText);
  // add class to delete button
  deleteButton.className = "delete";
  // add delete button to main span
  mainSpan.appendChild(deleteButton);
  // add the hole task to container
  if (state) {
    mainSpan.className = "task-box finished";
  }
  tasksContainer.appendChild(mainSpan);
}

function calculateTasks() {
  // Calculate All Tasks
  tasksCount.innerHTML = document.querySelectorAll(
    ".tasks-content .task-box"
  ).length;

  // Calculate Completed Tasks
  tasksCompleted.innerHTML = document.querySelectorAll(
    ".tasks-content .finished"
  ).length;
}
