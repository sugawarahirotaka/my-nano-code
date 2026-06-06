export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type TodoError = { success: false; error: string };
export type TodoSuccess<T> = { success: true; value: T };

export type CreateTodoList = {
  add: (title: string) => TodoSuccess<Todo> | TodoError;
  list: () => Todo[];
  complete: (id: number) => TodoSuccess<Todo> | TodoError;
  remove: (id: number) => TodoSuccess<Todo> | TodoError;
  listCompleted: () => Todo[];
  listActive: () => Todo[];
};

export function createTodoList(): CreateTodoList {
  let todos: Todo[] = [];
  let nextId = 1;

  const isBlank = (s: string): boolean => s.trim().length === 0;

  function add(title: string): TodoSuccess<Todo> | TodoError {
    if (isBlank(title)) {
      return { success: false, error: 'Title cannot be empty' };
    }
    const todo: Todo = { id: nextId++, title: title.trim(), completed: false };
    todos.push(todo);
    return { success: true, value: todo };
  }

  function list(): Todo[] {
    return todos.slice();
  }

  function findIndex(id: number): number {
    return todos.findIndex((t) => t.id === id);
  }

  function complete(id: number): TodoSuccess<Todo> | TodoError {
    const idx = findIndex(id);
    if (idx === -1) {
      return { success: false, error: `Todo with id ${id} not found` };
    }
    const updated: Todo = { ...todos[idx], completed: true };
    todos[idx] = updated;
    return { success: true, value: updated };
  }

  function remove(id: number): TodoSuccess<Todo> | TodoError {
    const idx = findIndex(id);
    if (idx === -1) {
      return { success: false, error: `Todo with id ${id} not found` };
    }
    const removed = todos.splice(idx, 1)[0];
    return { success: true, value: removed };
  }

  function listCompleted(): Todo[] {
    return todos.filter((t) => t.completed).slice();
  }

  function listActive(): Todo[] {
    return todos.filter((t) => !t.completed).slice();
  }

  return { add, list, complete, remove, listCompleted, listActive };
}
