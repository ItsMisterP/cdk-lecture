import { Router } from 'express';
import { Todo } from './types';

const router = Router();
let todos: Todo[] = [];

router.get('/todos', (req, res) => {
  res.json(todos);
});

router.post('/todos', (req, res) => {
  const newTodo: Todo = { id: Date.now(), text: req.body.text, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.delete('/todos/:id', (req, res) => {
  todos = todos.filter(todo => todo.id !== parseInt(req.params.id, 10));
  res.status(204).send();
});

export default router;