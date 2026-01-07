export interface Todo {
  id: string;
  title: string;
  dueDate: string;
  status: 'todo' | 'doing' | 'done'; // ステータスを追加
}
