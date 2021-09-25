import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterMode } from './todos/components/enums';
import { ITodo } from './todos/interfaces';
import { TodosService } from './todos/services/todos.service';
import { changeFilterMode, clearAllCompletedTasks } from './todos/state/todo.actions';
import { selectAllTodos, selectFilterMode } from './todos/state/todo.selectors';
import { Meta } from '@angular/platform-browser';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public availableFilterModes = FilterMode;
  public addTodoForm: FormGroup;
  public selectedFilterMode$: Observable<FilterMode>;
  public todoItemsLeft$: Observable<number>;

  public actualLang = 'en';

  constructor(
    private todosService: TodosService,
    private store: Store,
    private translocoService: TranslocoService,
    private metaTagService: Meta
  ) {}

  public ngOnInit() {
    this.setMetaTags();
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

  public changeLang(): void {
    const newLang = this.actualLang === 'en' ? 'es' : 'en';

    this.translocoService.setActiveLang(newLang);
    this.actualLang = newLang;
  }

  private initializeAddTodoForm() {
    this.addTodoForm = new FormGroup({
      taskContent: new FormControl('')
    });
  }

  private setMetaTags(): void {
    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Coding assignment with Angular using the Store'
      },
      { name: 'robots', content: 'index, follow' },
      { charset: 'UTF-8' }
    ]);
  }
}
