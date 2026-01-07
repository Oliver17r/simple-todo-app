import { useState } from 'react';
import { Todo } from './types';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [dueDateValue, setDueDateValue] = useState('');
  // 表示するステータスを選ぶための変数（all = 全て表示）
  const [filter, setFilter] = useState('all');

  const handleAddTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: inputValue,
      dueDate: dueDateValue,
      status: 'todo', // 最初は必ず「未着手(todo)」からスタート
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
    setDueDateValue('');
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // ステータスを変更する関数
  const handleStatusChange = (id: string, newStatus: 'todo' | 'doing' | 'done') => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, status: newStatus } : todo
    ));
  };

  // フィルタリングされたToDoリストを作成
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  return (
    <div className="app">
      <h1>Todo App (ステータス管理)</h1>
      
      {/* 入力エリア */}
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="新しいタスクを入力"
        />
        <input
          type="date"
          value={dueDateValue}
          onChange={(e) => setDueDateValue(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button onClick={handleAddTodo}>追加</button>
      </div>

      {/* ★追加: 表示切り替えボタン */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <label>表示切替: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '4px' }}>
          <option value="all">すべて</option>
          <option value="todo">未着手</option>
          <option value="doing">進行中</option>
          <option value="done">完了</option>
        </select>
      </div>

      {/* ToDoリスト表示 */}
      <ul className="todo-list">
        {filteredTodos.map((todo) => {
          const overdue = isOverdue(todo.dueDate);
          return (
            <li key={todo.id} className="todo-item" style={{
              backgroundColor: overdue ? '#ffe6e6' : '#f8f9fa',
              borderLeft: todo.status === 'done' ? '5px solid #28a745' : '5px solid #ccc' // 完了なら左に緑の線
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* ★追加: 各タスクのステータス変更プルダウン */}
                  <select 
                    value={todo.status} 
                    onChange={(e) => handleStatusChange(todo.id, e.target.value as any)}
                    style={{ fontSize: '12px', padding: '2px' }}
                  >
                    <option value="todo">未着手</option>
                    <option value="doing">進行中</option>
                    <option value="done">完了</option>
                  </select>
                  
                  <span style={{ 
                    textDecoration: todo.status === 'done' ? 'line-through' : 'none',
                    color: overdue ? 'red' : 'inherit'
                  }}>
                    {todo.title}
                  </span>
                </div>
                
                {todo.dueDate && (
                  <div style={{ fontSize: '0.85em', color: overdue ? '#d32f2f' : '#666', marginLeft: '90px' }}>
                    期限: {todo.dueDate} {overdue ? '(期限切れ)' : ''}
                  </div>
                )}
              </div>
              <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
