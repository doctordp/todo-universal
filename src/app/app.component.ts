import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterMode } from './todos/components/enums';
import { ITodo } from './todos/interfaces';
import { TodosService } from './todos/services/todos.service';
import { changeFilterMode, clearAllCompletedTasks } from './todos/state/todo.actions';
import { selectAllTodos, selectFilterMode } from './todos/state/todo.selectors';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public availableFilterModes = FilterMode;
  public addTodoForm: FormGroup;
  public selectedFilterMode$: Observable<FilterMode>;
  public todoItemsLeft$: Observable<number>;

  constructor(private todosService: TodosService, private store: Store) {}

  public ngOnInit() {
    this.initializeAddTodoForm();
    this.selectedFilterMode$ = this.store.pipe(select(selectFilterMode));
    this.todoItemsLeft$ = this.store.pipe(
      select(selectAllTodos),
      map((todos: ITodo[]) => {
        const leftTodo: ITodo[] = todos.filter((element: ITodo) => {
          return !element.completed;
        });

        return leftTodo.length;
      })
    );
  }

  public setFilterMode(filterMode: FilterMode) {
    this.store.dispatch(
      changeFilterMode({
        mode: filterMode
      })
    );
  }

  public clearAllCompletedTasks() {
    this.store.dispatch(clearAllCompletedTasks());
  }

  public todoInputKeyUp(event: KeyboardEvent) {
    const enterKeyValue = 'Enter';
    if (event.key === enterKeyValue) {
      const newTaskContent: string = this.addTodoForm.get('taskContent').value;

      if (newTaskContent?.length) {
        this.todosService.addTodo(newTaskContent);
        this.addTodoForm.get('taskContent').reset();
      }
    }
  }

  private initializeAddTodoForm() {
    this.addTodoForm = new FormGroup({
      taskContent: new FormControl('')
    });
  }
}
