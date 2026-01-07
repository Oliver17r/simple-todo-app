import { useState } from 'react';
import { Todo } from './types';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [dueDateValue, setDueDateValue] = useState('');
  const [filter, setFilter] = useState('all');
  // 並び順を管理する変数（created = 作成順, dueDate = 期限順）
  const [sortType, setSortType] = useState('created');

  const handleAddTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo: Todo = {
      // idは現在時刻(ミリ秒)なので、そのまま作成日時として扱えます
      id: Date.now().toString(),
      title: inputValue,
      dueDate: dueDateValue,
      status: 'todo',
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
    setDueDateValue('');
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: 'todo' | 'doing' | 'done') => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, status: newStatus } : todo
    ));
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  // フィルタリング処理（お題2の機能）
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  // 並び替え処理
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortType === 'dueDate') {
      // 期限日順：期限がないものは後ろへ
      const dateA = a.dueDate || '9999-99-99';
      const dateB = b.dueDate || '9999-99-99';
      return dateA.localeCompare(dateB);
    }
    if (sortType === 'status') {
      // ステータス順：未着手 -> 進行中 -> 完了
      const order = { todo: 1, doing: 2, done: 3 };
      return order[a.status] - order[b.status];
    }
    // デフォルト（created）：作成日時が新しい順（IDが大きい順）
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="app">
      <h1>Todo App (完成版)</h1>
      
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

      {/* フィルタと並び替えのコントロールエリア */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', background: '#eee', padding: '10px', borderRadius: '4px' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>絞り込み: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">すべて</option>
            <option value="todo">未着手</option>
            <option value="doing">進行中</option>
            <option value="done">完了</option>
          </select>
        </div>
        
        {/* 並び替えプルダウン */}
        <div>
          <label style={{ fontWeight: 'bold' }}>並び順: </label>
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="created">作成日順 (新着)</option>
            <option value="dueDate">期限日が近い順</option>
            <option value="status">ステータス順</option>
          </select>
        </div>
      </div>

      {/* ToDoリスト表示（sortedTodosを使う） */}
      <ul className="todo-list">
        {sortedTodos.map((todo) => {
          const overdue = isOverdue(todo.dueDate);
          return (
            <li key={todo.id} className="todo-item" style={{
              backgroundColor: overdue ? '#ffe6e6' : '#f8f9fa',
              borderLeft: todo.status === 'done' ? '5px solid #28a745' : '5px solid #ccc'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                    color: overdue ? 'red' : 'inherit',
                    fontWeight: 'bold'
                  }}>
                    {todo.title}
                  </span>
                </div>
                
                <div style={{ fontSize: '0.85em', color: '#666', marginLeft: '90px', marginTop: '4px' }}>
                   {todo.dueDate ? `期限: ${todo.dueDate}` : '期限なし'}
                   {overdue && <span style={{ color: 'red', fontWeight: 'bold' }}> (期限切れ)</span>}
                </div>
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
