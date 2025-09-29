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
    li.appendChild(del);
    list.appendChild(li);
  });
  updateStats();
}

// 追加処理
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const todo = { id: Date.now(), text, done: false };
  todos.push(todo);
  input.value = '';
  save();
  render();
});

// 初回レンダー
render();
