import { createAction, props } from '@ngrx/store';
import { FilterMode } from '../components/enums';

export const addTodo = createAction('[Todos] Add Todo', props<{ text: string }>());

export const removeTodo = createAction('[Todos] Remove Todo', props<{ index: number }>());

export const editTodo = createAction('[Todos] Edit Todo', props<{ index: number }>());

export const updateTodo = createAction(
  '[Todos] Update Todo',
  props<{ index: number; text: string }>()
);

export const toggleCompleted = createAction('[Todos] Toggle Completed', props<{ index: number }>());

export const changeFilterMode = createAction(
  '[Todos] Change Filter Mode',
  props<{ mode: FilterMode }>()
);

export const clearCompleted = createAction('[Todos] Clear Completed');

export const removeTaskById = createAction('[Todos] Remove task by ID', props<{ id: string }>());

export const toggleTaskCompletedStatus = createAction(
  '[Todos] Toggle task completed by ID',
  props<{ id: string; newCompletedValue: boolean }>()
);

export const markAllTasksAsCompleted = createAction('[Todos] Mark all as completed');

export const clearAllCompletedTasks = createAction('[Todos] Clear all completed tasks');

export const updateTaskContent = createAction(
  '[Todos] Update task content by ID',
  props<{ id: string; content: string }>()
);
