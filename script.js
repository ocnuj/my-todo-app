const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const stats = document.getElementById('stats');

// 初期化
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let deletedStack = []; // 複数件の削除履歴を保存するスタック

// ------------------------
// 保存と統計更新
// ------------------------
function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
  updateStats();
  console.log("✅ save() 実行: ", todos);
}

function updateStats() {
  const total = todos.length;
  const done = todos.filter(t => t.done).length;
  stats.textContent = `${total} 件中 ${done} 完了`;
}

// ------------------------
// レンダリング
// ------------------------
function render() {
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');

    // ✅ チェックボックス
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = todo.done;
    chk.addEventListener('change', () => {
      todo.done = chk.checked;
      save();
      render();
    });

    // ✅ テキスト
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.contentEditable = true;
    span.addEventListener('blur', () => {
      todo.text = span.textContent.trim();
      save();
      render();
    });
    span.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
    });

    // ✅ 日付表示
    const dateSpan = document.createElement('span');
    dateSpan.style.fontSize = "12px";
    dateSpan.style.color = "#6b7280";
    dateSpan.style.marginLeft = "10px";
    dateSpan.textContent = todo.date ? `期限: ${todo.date}` : "";

    // ✅ 削除ボタン
    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '✕';
    del.setAttribute('aria-label','削除');
    del.addEventListener('click', () => {
      console.log("🗑 削除: ", todo);
      deletedStack.push({ ...todo }); // スタックに追加
      todos = todos.filter(t => t.id !== todo.id);
      save();
      render();
    });

    // li に追加
    li.appendChild(chk);
    li.appendChild(span);
    li.appendChild(dateSpan);
    li.appendChild(del);
    list.appendChild(li);
  });
  updateStats();
}

// ------------------------
// タスク追加
// ------------------------
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const date = document.getElementById('todo-date').value;

  if (!text) return;

  const todo = {
    id: Date.now(),
    text,
    date: date || "", 
    done: false
  };

  todos.push(todo);
  input.value = '';
  document.getElementById('todo-date').value = '';
  save();
  render();
  console.log("➕ 追加: ", todo);
});

// ------------------------
// 削除を取り消す (スタック方式)
// ------------------------
function undoDelete() {
  if (deletedStack.length > 0) {
    const lastDeleted = deletedStack.pop(); // スタックの最後を取り出す
    todos.push(lastDeleted);
    save();
    render();
    console.log("↩️ 復元: ", lastDeleted);
  } else {
    alert("戻すタスクはありません");
  }
}

// ------------------------
// .txt に保存
// ------------------------
function exportTodosAsTxt() {
  const lines = todos.map(t => {
    return `${t.text} ${t.date ? "(期限: " + t.date + ")" : ""} [${t.done ? "完了" : "未完了"}]`;
  });
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "todos.txt";
  a.click();
  URL.revokeObjectURL(url);

  console.log("💾 todos.txt として保存しました");
}

// ------------------------
// 初回レンダー
// ------------------------
render();
