import React, { useState, useEffect } from 'react';
import api from './api/axiosConfig';
import { Todo } from './types';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = () => {
      api.get('/todos')
        .then(response => {
          const todos: Todo[] = response.data.map((todo: any) => ({
            ...todo,
            id: String(todo.id),
          }));
          setTodos(todos);
        })
        .catch(error => console.error('Fehler beim Abrufen der To-Dos:', error));
    };
  
    fetchTodos();
    const interval = setInterval(fetchTodos, 5000); // Aktualisiere alle 5 Sekunden
  
    return () => clearInterval(interval); // Aufräumen bei Komponentendemontage
  }, []);

  const addTodo = (text: string) => {
    api.post('/todos', { text })
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response.data]);
      })
      .catch(error => console.error('Fehler beim Hinzufügen des To-Dos:', error));
  };

  const deleteTodo = (id: string) => { // ID als `string` anpassen
    api.delete(`/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(error => console.error('Fehler beim Löschen des To-Dos:', error));
  };

  return (
    <div>
      <h1>To-Do Liste</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} deleteTodo={deleteTodo} />
    </div>
  );
};

export default App;
