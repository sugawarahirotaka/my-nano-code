import { describe, it, expect } from 'vitest';
import { createTodoList } from './todo';

describe('todo', () => {
  it('can add and list todos', () => {
    const list = createTodoList();
    const res = list.add('Buy milk');
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.value.title).toBe('Buy milk');
      expect(res.value.completed).toBe(false);
      expect(res.value.id).toBe(1);
    }
    const all = list.list();
    expect(all.length).toBe(1);
  });

  it('does not add empty or whitespace titles', () => {
    const list = createTodoList();
    const res1 = list.add('');
    expect(res1.success).toBe(false);
    const res2 = list.add('   ');
    expect(res2.success).toBe(false);
  });

  it('can complete and listCompleted/listActive', () => {
    const list = createTodoList();
    list.add('Task 1');
    list.add('Task 2');
    const c = list.complete(1);
    expect(c.success).toBe(true);
    const completed = list.listCompleted();
    const active = list.listActive();
    expect(completed.length).toBe(1);
    expect(active.length).toBe(1);
  });

  it('returns error for non-existent id on complete/remove', () => {
    const list = createTodoList();
    const c = list.complete(999);
    expect(c.success).toBe(false);
    const r = list.remove(999);
    expect(r.success).toBe(false);
  });

  it('can remove a todo', () => {
    const list = createTodoList();
    list.add('A');
    list.add('B');
    const r = list.remove(1);
    expect(r.success).toBe(true);
    const all = list.list();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe(2);
  });
});
