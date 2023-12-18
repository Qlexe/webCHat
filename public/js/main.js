class Task {
  constructor(text, date) {
      this.text = text;
      this.date = date;
      this.isDone = false;
  }
}

let dataService = {
  dbServer: "https://webCHat.oleksandrkap.repl.co/tasks/",
  tasks: [],

  get allTasks() {
      return this.tasks;
  },

  get notCompletedTasks() {
      return this.tasks.filter(task => task.isDone == false);
  },

  add(task) {
      this.tasks.push(task);
      this.save();
  },

  save() {
      // localStorage.setItem("tasks", JSON.stringify(this.tasks));
      console.log(this.tasks);
      fetch(this.dbServer + 1, {
          method: 'PUT',
          body: JSON.stringify({
              oleksandr: this.tasks,
          }),
          headers: {
              'Content-type': 'application/json; charset=UTF-8',
          },
      })
          .then((response) => response.json())
          .then((json) => console.log(json));
  },

  open() {
      // this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      console.log(this.tasks);
      if (this.tasks.length == 0) {
          console.log("new user")
          fetch(this.dbServer, {
              method: 'POST',
              body: JSON.stringify({
                  oleksandr: this.tasks,
                  id: 1,
              }),
              headers: {
                  'Content-type': 'application/json; charset=UTF-8',
              }
          })
      }
      fetch(this.dbServer + 1)
          .then(tasksArry => tasksArry.json())
          .then(json => {
              this.tasks = json.oleksandr;
              console.log(this.tasks)
          })
  },

  delete(task) {
      let index = this.tasks.indexOf(task);
      this.tasks.splice(index, 1);
      this.save();
  },

  clear() {
      console.log(this.tasks);
      console.log("deleted Data")
      fetch(this.dbServer + 1, {
          method: 'DELETE'
      })
          .then((response) => response.json())
          .then((json) => console.log(json));
  }

  // deleteAllPosts() {
  //     const postsIdsArray = this.posts.map((post) => post.id)
  //     postsIdsArray.forEach((id) => this.deletePost(id))
  // }
}

class TasksListView {
  element;

  constructor(element) {
      this.element = element;
  }

  showAll() {
      this.element.innerHTML = "";

      let tasks = dataService.allTasks;
      if (tasks.length == 0) return;

      tasks.forEach(task => {
          new TaskView(task).createIn(this.element);
      });
  }

  showNotCompleted() {
      this.element.innerHTML = "";

      let tasks = dataService.notCompletedTasks;
      if (tasks.length == 0) return;

      tasks.forEach(task => {
          new TaskView(task).createIn(this.element);
      });
  }

  dleteAll() {
      this.element.innerHTML = "";
      dataService.clear();
      window.location.reload();
  }
}

class TaskView {
  constructor(task) {
      this.task = task;
      this.div = null;
  }

  createIn(element) {
      let divTemplate = document.querySelector(".todo_task");
      this.div = divTemplate.cloneNode(false);

      let inputTemplate = document.querySelector(".todo_check");
      let input = inputTemplate.cloneNode(true);
      input.addEventListener("click", this.changeState.bind(this));

      let pTemplate = document.querySelector(".todo_text");
      let p = pTemplate.cloneNode(false);
      p.innerText = this.task.text;

      let countDayTemplate = document.querySelector(".todo_date-count");
      let dayCount = countDayTemplate.cloneNode(false);
      dayCount.innerText = this.dayCount();

      let taskBlockInfo = document.createElement("div");
      taskBlockInfo.classList.add("task_info_block");
      taskBlockInfo.append(p);
      taskBlockInfo.append(dayCount);

      let btnDelTemplate = document.querySelector(".todo_delete");
      let btnDel = btnDelTemplate.cloneNode(true);
      btnDel.addEventListener("click", this.delete.bind(this));
      btnDel.hidden = true;

      this.div.append(input);
      this.div.append(btnDel);
      this.div.append(taskBlockInfo);


      if (this.task.isDone) {
          this.div.classList.add("completed");
          input.hidden = true;
          btnDel.hidden = false;
      }

      element.append(this.div);
  }

  dayCount() {
      let date = this.task.date;
      let days = (currentDate - date) / 86400000;

      if (!days) return 0;
      return Math.round(days);
  }

  changeState() {
      this.task.isDone = !this.isDone;
      dataService.save();
      this.div.classList.toggle("completed");
      tasksListView.showNotCompleted();
  }

  delete() {
      dataService.delete(this.task);
      this.div.remove();
  }
};

let taskInput = document.querySelector("#task_input");
let taskAddBtn = document.querySelector("#task_add");
let showNotCompletedBtn = document.querySelector("#show_not_completed");
let showAllBtn = document.querySelector("#show_all");
let taskList = document.querySelector("#task_list");
let startMessage = document.querySelector("#start_message");
let deleteAllBtn = document.querySelector("#delete_all");

let currentDate = Date.parse(new Date());

dataService.open();
let tasksListView = new TasksListView(taskList);
window.addEventListener("load", function () {
  tasksListView.showNotCompleted();
  if (dataService.allTasks.length > 0) startMessage.hidden = true;
});

taskAddBtn.addEventListener("click", addTaskHandler);
taskInput.addEventListener("keydown", function (e) {
  if (e.code == "Enter") addTaskHandler();
});
showAllBtn.addEventListener("click", function () { tasksListView.showAll() });
showNotCompletedBtn.addEventListener("click", function () { tasksListView.showNotCompleted() });
deleteAllBtn.addEventListener("click", function () { tasksListView.dleteAll() });

function addTaskHandler() {
  if (taskInput.value) {
      if (!startMessage.hidden) startMessage.hidden = true;

      let newTask = new Task(taskInput.value, Date.parse(new Date()));
      dataService.add(newTask);

      tasksListView.showNotCompleted();
      taskInput.value = "";
  } else {
      alert("enter task");
  }
};

setInterval(() => refresh(), 2000)

function refresh(){
  dataService.open();
  tasksListView.showNotCompleted()
}