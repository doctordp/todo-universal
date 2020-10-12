import { Action, createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';
import { ITodo } from '../interfaces/ITodo';
import { FilterMode } from '../components/enums';
import * as uuid from 'uuid';

export interface ITodosState {
  filterMode?: FilterMode;
  todos?: ITodo[];
}

export const initialState: ITodosState = {
  filterMode: FilterMode.All,
  todos: []
};

export function todosReducer(state: ITodosState, action: Action) {
  return createReducer(
    initialState,
    on(TodoActions.addTodo, (existingState, action) => {
      const newTask: ITodo = {
        text: action.text,
        completed: false,
        creationTimeStamp: new Date().getTime(),
        id: uuid.v4()
      };

      return {
        ...existingState,
        todos: [newTask, ...existingState.todos]
      };
    }),
    on(TodoActions.removeTodo, (existingState, { index }) => {
      const updatedTodos = [...existingState.todos];
      updatedTodos.splice(index, 1);

      return {
        ...existingState,
        todos: updatedTodos
      };
    }),
    on(TodoActions.changeFilterMode, (existingState, { mode }) => ({
      ...existingState,
      filterMode: mode
    })),
    on(TodoActions.clearCompleted, (existingState) => ({
      ...existingState,
      todos: [...existingState.todos.filter((todo) => !todo.completed)]
    })),
    on(TodoActions.removeTaskById, (existingState, { id }) => {
      const updatedTodos = [...existingState.todos].filter((todo: ITodo) => {
        return todo.id !== id;
      });

      return {
        ...existingState,
        todos: updatedTodos
      };
    }),
    on(TodoActions.toggleTaskCompletedStatus, (existingState, { id, newCompletedValue }) => {
      const updatedTodos = [...existingState.todos].map((todo: ITodo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: newCompletedValue
          };
        }

        return todo;
      });

      return {
        ...existingState,
        todos: updatedTodos
      };
    }),
    on(TodoActions.markAllTasksAsCompleted, (existingState, action) => {
      let newTodosState: ITodo[] = [];

      const completedTasks = existingState.todos.filter((todo: ITodo) => {
        return todo.completed;
      });

      if (completedTasks.length === existingState.todos.length) {
        // This means all tasks are already completed, so mark as active
        newTodosState = existingState.todos.map((todo: ITodo) => {
          return {
            ...todo,
            completed: false
          };
        });
      } else {
        newTodosState = existingState.todos.map((todo: ITodo) => {
          return {
            ...todo,
            completed: true
          };
        });
      }

      return {
        ...existingState,
        todos: newTodosState
      };
    }),
    on(TodoActions.clearAllCompletedTasks, (existingState, action) => {
      const updatedTodos = [...existingState.todos].filter((todo: ITodo) => {
        return !todo.completed;
      });

      return {
        ...existingState,
        todos: updatedTodos
      };
    }),
    on(TodoActions.updateTaskContent, (existingState, action) => {
      const updatedTodos = [...existingState.todos].map((todo: ITodo) => {
        if (action.id === todo.id) {
          return {
            ...todo,
            text: action.content
          };
        }

        return todo;
      });

      return {
        ...existingState,
        todos: updatedTodos
      };
    })
  )(state, action);
}

export const filterMode = (state: ITodosState) => state.filterMode;
export const todos = (state: ITodosState) => state.todos;
