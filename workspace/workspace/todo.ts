export type Todo = { id: number; title: string; completed: boolean };

export type AddResult =
  | { success: true; todo: Todo }
  | { success: false; error: string };

export type IdResult<T> = { success: true; todo: T } | { success: false; error: string };

export function createTodoList() {
  let todos: Todo[] = [];
  let nextId = 1;

  function isBlank(title: string): boolean {
    return title.trim().length === 0;
  }

  function add(title: string): AddResult {
    if (isBlank(title)) {
      return { success: false, error: 'Title cannot be empty or whitespace' };
    }
    const todo: Todo = { id: nextId++, title, completed: false };
    todos = [...todos, todo];
    return { success: true, todo };
  }

  function list(): Todo[] {
    return [...todos];
  }

  function complete(id: number): IdResult<Todo> {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) {
      return { success: false, error: `Todo with id ${id} not found` };
    }
    const updated: Todo = { ...todos[idx], completed: true };
    todos = [...todos.slice(0, idx), updated, ...todos.slice(idx + 1)];
    return { success: true, todo: updated };
  }

  function remove(id: number): { success: true } | { success: false; error: string } {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) {
      return { success: false, error: `Todo with id ${id} not found` };
    }
    todos = [...todos.slice(0, idx), ...todos.slice(idx + 1)];
    return { success: true };
  }

  function listCompleted(): Todo[] {
    return todos.filter((t) => t.completed).map((t) => ({ ...t }));
  }

  function listActive(): Todo[] {
    return todos.filter((t) => !t.completed).map((t) => ({ ...t }));
  }

  return {
    add,
    list,
    complete,
    remove,
    listCompleted,
    listActive,
  } as const;
}
