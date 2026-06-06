import { describe, it, expect } from 'vitest';
import { createTodoList } from './todo';

describe('todo list', () => {
  it('should add and list todos', () => {
    const list = createTodoList();
    const r1 = list.add('first');
    expect(r1.success).toBe(true);
    if (r1.success) {
      expect(r1.todo.id).toBe(1);
      expect(r1.todo.title).toBe('first');
      expect(r1.todo.completed).toBe(false);
    }
    const r2 = list.add('second');
    expect(r2.success).toBe(true);
    if (r2.success) {
      expect(r2.todo.id).toBe(2);
    }

    const all = list.list();
    expect(all.length).toBe(2);
  });

  it('should not add blank titles', () => {
    const list = createTodoList();
    const r = list.add('   ');
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error).toBe('Title cannot be empty or whitespace');
    }
  });

  it('should complete and listCompleted/listActive', () => {
    const list = createTodoList();
    list.add('a');
    list.add('b');
    const c = list.complete(1);
    expect(c.success).toBe(true);
    if (c.success) {
      expect(c.todo.completed).toBe(true);
    }

    const completed = list.listCompleted();
    expect(completed.length).toBe(1);
    expect(completed[0].id).toBe(1);

    const active = list.listActive();
    expect(active.length).toBe(1);
    expect(active[0].id).toBe(2);
  });

  it('should return error for non-existent id on complete/remove', () => {
    const list = createTodoList();
    list.add('x');
    const r1 = list.complete(999);
    expect(r1.success).toBe(false);
    if (!r1.success) {
      expect(r1.error).toBe('Todo with id 999 not found');
    }

    const r2 = list.remove(999);
    expect(r2.success).toBe(false);
    if (!r2.success) {
      expect(r2.error).toBe('Todo with id 999 not found');
    }
  });

  it('should remove todo by id', () => {
    const list = createTodoList();
    list.add('one');
    list.add('two');
    const r = list.remove(1);
    expect(r.success).toBe(true);
    const all = list.list();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe(2);
  });
});
