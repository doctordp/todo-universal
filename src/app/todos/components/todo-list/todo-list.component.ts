import { Component, OnDestroy, OnInit } from '@angular/core';
import { selectAllTodos, selectFilterMode } from '@app/todos/state/todo.selectors';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { ITodo } from '@app/todos/interfaces';
import { FilterMode } from '../enums';
import {
  removeTaskById,
  toggleTaskCompletedStatus,
  updateTaskContent
} from '@app/todos/state/todo.actions';

@Component({
  selector: 'app-todos-list',
  styleUrls: ['./todo-list.component.scss'],
  templateUrl: './todo-list.component.html'
})
export class TodosListComponent implements OnInit, OnDestroy {
  public allTodos: ITodo[] = [];
  public filteredTodos: ITodo[] = [];
  public activeFilter: FilterMode = FilterMode.Active;
  public availableFilterModes = FilterMode;

  public editedElementId: string = null;

  private destroy$ = new Subject();

  constructor(private store: Store) {}

  public ngOnInit() {
    const allTodosSelector$: Observable<ITodo[]> = this.store.pipe(select(selectAllTodos));
    const currentFilterSelector$: Observable<FilterMode> = this.store.pipe(
      select(selectFilterMode)
    );

    combineLatest([allTodosSelector$, currentFilterSelector$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([allTodos, currentFilter]) => {
          this.activeFilter = currentFilter;
          this.updateTodosView(allTodos, currentFilter);
        }
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public editTaskContent(todoItem: ITodo, labelReference: HTMLLabelElement) {
    this.editedElementId = todoItem.id;

    setTimeout(function () {
      labelReference.focus();
    }, 0);
  }

  public disableEditMode() {
    this.editedElementId = null;
  }

  public updateTaskContentOnEnter(
    todo: ITodo,
    event: KeyboardEvent,
    labelReference: HTMLLabelElement
  ) {
    const enterKeyValue = 'Enter';

    if (event.key === enterKeyValue) {
      const newTaskValue: string = labelReference.innerText;

      this.store.dispatch(
        updateTaskContent({
          id: todo.id,
          content: newTaskValue
        })
      );
      this.editedElementId = null;
      return event.preventDefault();
    }
  }

  public markTodoAsCompleted(todo: ITodo) {
    this.store.dispatch(
      toggleTaskCompletedStatus({
        id: todo.id,
        newCompletedValue: !todo.completed
      })
    );
  }

  public removeTodoTask(todo: ITodo) {
    this.store.dispatch(removeTaskById({ id: todo.id }));
  }

  private updateTodosView(allTodos: ITodo[], currentFilter: FilterMode) {
    this.allTodos = allTodos;
    this.filteredTodos = allTodos.filter((todoElement: ITodo) => {
      if (currentFilter === FilterMode.All) {
        return true;
      }

      if (currentFilter === FilterMode.Completed) {
        return todoElement.completed;
      }

      if (currentFilter === FilterMode.Active) {
        return !todoElement.completed;
      }

      return true;
    });
  }
}
