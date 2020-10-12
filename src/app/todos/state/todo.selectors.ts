import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as todosState from './todos.reducer';

export const todosSelector = createFeatureSelector<todosState.ITodosState>('todos');

export const allTodos = createSelector(todosSelector, todosState.todos);

export const selectAllTodos = createSelector(todosSelector, (todosState) => todosState.todos);

export const selectFilterMode = createSelector(
  todosSelector,
  (todosState) => todosState.filterMode
);
