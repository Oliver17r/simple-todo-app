import { useState } from 'react';
import { Todo } from './types';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  //  期限日の入力値を管理する変数
  const [dueDateValue, setDueDateValue] = useState('');

  const handleAddTodo = () => {
    if (inputValue.trim() === '') {
      return;
    }
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: inputValue,
      dueDate: dueDateValue, // 入力された期限日を保存
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
    setDueDateValue(''); // 入力欄をクリア
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 今日の日付と比べて期限切れか判定する関数
  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0]; // "2025-01-01" の形式で今日を取得
    return dueDate < today;
  };

  return (
    <div className="app">
      <h1>Todo App</h1>
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="新しいタスクを入力"
        />
        {/* 期限日の入力欄 */}
        <input
          type="date"
          value={dueDateValue}
          onChange={(e) => setDueDateValue(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button onClick={handleAddTodo}>追加</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => {
          // 期限切れかどうかチェック
          const overdue = isOverdue(todo.dueDate);
          
          return (
            <li key={todo.id} className="todo-item" style={{
              //  期限切れなら背景を赤っぽく
              backgroundColor: overdue ? '#ffe6e6' : '#f8f9fa'
            }}>
              {/* 表示内容を少し調整: タイトルと期限を表示 */}
              <div style={{ flex: 1 }}>
                <div style={{ color: overdue ? 'red' : 'inherit' }}>
                  {todo.title}
                </div>
                {todo.dueDate && (
                  <div style={{ fontSize: '0.85em', color: overdue ? '#d32f2f' : '#666' }}>
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
