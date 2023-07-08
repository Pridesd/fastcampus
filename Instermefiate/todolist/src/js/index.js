import '../scss/style.scss';
import '@fortawesome/fontawesome-free/js/all.min.js'; //rollupjs에서 fontawesome과 같은 제 3의 라이브러리를 사용하기 위해선 별도의 플러그인을 다운로드 받아야 함 @rollup/plugin-node-resolve//

class Router {
  routes = [];
  notFoundCallback = () => {};
  addRoute(url, callback) {
    this.routes.push({
      url,
      callback,
    });
    return this;
  }

  checkRoutes() {
    const currentRoute = this.routes.find(
      route => route.url === window.location.hash, //현재 해시값과 라우트를 비교
    );

    if (!currentRoute) {
      this.notFoundCallback();
      return;
    }
    currentRoute.callback();
  }

  init() {
    window.addEventListener('hashchange', this.checkRoutes.bind(this));
    if (!window.location.hash) {
      window.location.hash = '#/';
    }
    this.checkRoutes();
  }

  setNotFound(callback) {
    this.notFoundCallback = callback;
    return this;
  }
}

class Storage {
  //id, content, status를 담을 예정
  saveTodo(id, todoContent) {
    const todosData = this.getTodos();
    todosData.push({ id, content: todoContent, status: 'TOTO' });
    localStorage.setItem('todos', JSON.stringify(todosData));
  }

  editTodo(id, todoContent, status = 'TODO') {
    const todosData = this.getTodos();
    const todoIndex = todosData.findIndex(todo => todo.id == id);
    const targetTodoData = todosData[todoIndex];
    const editedTodoData =
      todoContent === ''
        ? { ...targetTodoData, status }
        : { ...targetTodoData, content: todoContent };
    todosData.splice(todoIndex, 1, editedTodoData);
    localStorage.setItem('todos', JSON.stringify(todosData));
  }

  deleteTodo(id) {
    const todosData = this.getTodos();
    todosData.splice(
      todosData.findIndex(todo => todo.id == id),
      1,
    );
    localStorage.setItem('todos', JSON.stringify(todosData));
  }

  getTodos() {
    return localStorage.getItem('todos') === null
      ? []
      : JSON.parse(localStorage.getItem('todos'));
  }
}

class todoList {
  constructor(storage) {
    this.initStorage(storage);
    this.assignElement();
    this.addEvent();
    this.loadSavedData();
  }

  initStorage(storage) {
    this.storage = storage;
  }
  assignElement() {
    this.inputContainerEl = document.getElementById('input-container');
    this.inputAreaEl = this.inputContainerEl.querySelector('#input-area');
    this.todoInputEl = this.inputAreaEl.querySelector('#todo-input');
    this.addBtnEl = this.inputAreaEl.querySelector('#add-btn');
    this.todoContainerEl = document.getElementById('todo-container');
    this.todoListEl = this.todoContainerEl.querySelector('#todo-list');
    this.todoEL = this.todoListEl.querySelector('.todo');
    this.radioAreaEl = this.inputContainerEl.querySelector('#radio-area');
    this.filterRadioBtnEls = this.radioAreaEl.querySelectorAll(
      'input[name="filter"]',
    );
  }

  loadSavedData() {
    const todosData = this.storage.getTodos();
    for (const todoData of todosData) {
      const { id, content, status } = todoData;
      this.createTodoElement(id, content, status);
    }
  }

  addEvent() {
    this.todoInputEl.addEventListener('change', this.onChangeValue.bind(this));
    this.addBtnEl.addEventListener('click', this.onClickAddBtn.bind(this));
    this.todoListEl.addEventListener('click', this.onClickTodoBtn.bind(this));
    this.addRadioBtnEvent();
  }

  addRadioBtnEvent() {
    for (const filterRadioBtnEl of this.filterRadioBtnEls) {
      filterRadioBtnEl.addEventListener(
        'click',
        this.onClickRadioBtn.bind(this),
      );
    }
  }

  onClickRadioBtn(e) {
    const { value } = e.target;
    window.location.href = `#/${value.toLowerCase()}`;
  }

  filterTodo(value) {
    const todoDivEls = this.todoListEl.querySelectorAll('div.todo');
    for (const todoDivEl of todoDivEls) {
      switch (value) {
        case 'ALL':
          todoDivEl.style.display = 'flex';
          break;
        case 'TODO':
          todoDivEl.style.display = todoDivEl.classList.contains('done')
            ? 'none'
            : 'flex';
          break;
        case 'DONE':
          todoDivEl.style.display = todoDivEl.classList.contains('done')
            ? 'flex'
            : 'none';
          break;
      }
    }
  }

  onClickTodoBtn(e) {
    const btn = e.target.closest('button');
    if (btn.matches('#delete-btn')) {
      this.deleteTodo(e.target);
    } else if (btn.matches('#edit-btn')) {
      this.editTodo(e.target);
    } else if (btn.matches('#save-btn')) {
      this.saveTodo(e.target);
    } else if (btn.matches('#complete-btn')) {
      this.completeTodo(e.target);
    }
  }

  completeTodo(target) {
    const todo = target.closest('.todo');
    todo.classList.toggle('done');
    this.storage.editTodo(
      todo.dataset.id,
      '',
      todo.classList.contains('done') ? 'DONE' : 'TODO',
    );
  }

  saveTodo(target) {
    const todo = target.closest('.todo');
    const input = todo.querySelector('input');
    if (input.readOnly) {
      return;
    } else {
      todo.readOnly = true;
      todo.classList.remove('edit');
      const id = todo.dataset.id;
      this.storage.editTodo(id, input.value);
    }
  }

  editTodo(target) {
    const todo = target.closest('.todo');
    const input = todo.querySelector('input');
    input.focus();
    todo.classList.add('edit');
    input.readOnly = false;
  }

  deleteTodo(target) {
    const todo = target.closest('.todo');
    todo.addEventListener('transitionend', () => {
      todo.remove();
    });
    todo.classList.add('delete');
    this.storage.deleteTodo(todo.dataset.id);
  }

  onClickAddBtn() {
    if (this.todoInputEl.value.length === 0) {
      alert('값을 입력해주세요');
      return;
    } else {
      const id = Date.now();
      this.storage.saveTodo(id, this.todoInputEl.value);
      this.createTodoElement(id, this.todoInputEl.value);
    }
  }

  createTodoElement(id, value, status = null) {
    const newDiv = document.createElement('div');
    newDiv.classList.add('todo');
    if (status === 'DONE') {
      newDiv.classList.add('done');
    }
    newDiv.dataset.id = id;
    const newInput = document.createElement('input');
    newInput.classList.add('todo-item');
    newInput.value = value;
    newInput.readOnly = true;
    newDiv.appendChild(newInput);
    const fragment = document.createDocumentFragment();
    fragment.appendChild(
      this.createBtn('complete-btn', 'complete-btn', ['fas', 'fa-check']),
    );
    fragment.appendChild(
      this.createBtn('edit-btn', 'edit-btn', ['fas', 'fa-edit']),
    );
    fragment.appendChild(
      this.createBtn('save-btn', 'save-btn', ['fas', 'fa-save']),
    );
    fragment.appendChild(
      this.createBtn('delete-btn', 'delete-btn', ['fas', 'fa-trash']),
    );

    newDiv.appendChild(fragment);
    this.todoListEl.appendChild(newDiv);
  }

  createBtn(btnId, btnClass, iClass) {
    const btn = document.createElement('button');
    btn.classList.add(btnClass);
    btn.id = btnId;

    const icon = document.createElement('i');
    icon.classList.add(...iClass);
    btn.appendChild(icon);
    return btn;
  }

  onChangeValue(e) {
    this.inputValue = e.target.value;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const router = new Router();
  const todo = new todoList(new Storage());
  const routeCallback = status => () => {
    todo.filterTodo(status);
    document.querySelector(
      `input[type='radio'][value='${status}']`,
    ).checked = true;
  };
  router
    .addRoute('#/all', routeCallback('ALL'))
    .addRoute('#/todo', routeCallback('TODO'))
    .addRoute('#/done', routeCallback('DONE'))
    .setNotFound(routeCallback('ALL'))
    .init();
});
