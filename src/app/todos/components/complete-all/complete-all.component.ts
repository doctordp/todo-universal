import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TodosService } from '@app/todos/services/todos.service';
import { Store } from '@ngrx/store';
import { markAllTasksAsCompleted } from '@app/todos/state/todo.actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-complete-all',
  styleUrls: ['./complete-all.component.scss'],
  templateUrl: './complete-all.component.html'
})
export class CompleteAllComponent implements OnInit, OnDestroy {
  multipleTodosExist = false;
  subscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private todosService: TodosService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.subscription = this.todosService.allTodos$.subscribe((todos) => {
      this.multipleTodosExist = todos && todos.length > 1;
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleCompleteAll(): void {
    this.store.dispatch(markAllTasksAsCompleted());
  }
}
