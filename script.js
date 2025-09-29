const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const stats = document.getElementById('stats');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
  updateStats();
}

function updateStats() {
  const total = todos.length;
  const done = todos.filter(t => t.done).length;
  stats.textContent = `${total} 件中 ${done} 完了`;
}

function render() {
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');

    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = todo.done;
    chk.addEventListener('change', () => {
      todo.done = chk.checked;
      save();
      render();
    });

    const span = document.createElement('span');
    span.textContent = todo.text;
    span.contentEditable = true;
    span.addEventListener('blur', () => {
      todo.text = span.textContent.trim();
      save();
      render();
    });
    // Enter in editable span should blur (finish editing)
    span.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
    });

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '✕';
    del.setAttribute('aria-label','削除');
    del.addEventListener('click', () => {
      todos = todos.filter(t => t.id !== todo.id);
      save();
      render();
    });

    li.appendChild(chk);
    li.appendChild(span);
    const dateSpan = document.createElement('span');
    dateSpan.style.fontSize = "12px";
    dateSpan.style.color = "#6b7280";
    dateSpan.textContent = todo.date ? `期限: ${todo.date}` : "";
    li.appendChild(dateSpan);
    li.appendChild(del);
    list.appendChild(li);
  });
  updateStats();
}

// 追加処理
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const date = document.getElementById('todo-date').value;

  if (!text) return;

  const todo = {
    id: Date.now(),
    text,
    date: date || "",  // 日付が空なら空文字
    done: false
  };

  todos.push(todo);
  input.value = '';
  document.getElementById('todo-date').value = ''; // 入力欄リセット
  save();
  render();
});

// 初回レンダー
render();

let deletedTask = null; // 直前に削除したタスクを保存

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const taskText = taskInput.value;
  const taskDate = dateInput.value;

  if (taskText === "") return;

  const li = document.createElement("li");
  li.textContent = `${taskText} (${taskDate})`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "削除";
  deleteBtn.onclick = function () {
    deletedTask = li; // 削除する前に保存
    li.remove();
  };

  li.appendChild(deleteBtn);
  document.getElementById("taskList").appendChild(li);

  taskInput.value = "";
  dateInput.value = "";
}

function undoDelete() {
  if (deletedTask) {
    document.getElementById("taskList").appendChild(deletedTask);
    deletedTask = null;
  } else {
    alert("戻すタスクはありません");
  }
}
