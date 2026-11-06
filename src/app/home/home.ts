import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Auth } from '../auth/auth';
import { TodoClient } from '../todo-client';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TodoCard } from './todo-card/todo-card';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  imports: [MatCardModule, MatButtonModule, MatIconModule, TodoCard, RouterLink, MatCheckboxModule],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {
  brkPntService = inject(BreakpointObserver);
  smallScreen = signal(false);
  authService = inject(Auth);
  user = this.authService.user();
  todoService = inject(TodoClient)
  todos = signal<Todo[]>([]);
  breakpointSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.setResponsiveObservables();
    this.fetchTodos();
  }

  setResponsiveObservables(): void {
    this.breakpointSubscription = this.brkPntService.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.smallScreen.set(false);
      if (result.matches) {
        this.smallScreen.set(true);
      }
    });
  }

  fetchTodos(): void {
    this.todoService.getTodos().subscribe(res => {
      const parsedDateTodos = res.data.map((todo: any) => {
        todo.createdAt = new Date(todo.created_at);
        delete todo.created_at;
        if (todo.deadline) {
          todo.deadline = new Date(todo.deadline);
        }
        return todo;
      });
      this.todoService.todos.set(parsedDateTodos);
      this.todos.set(this.todoService.todos());
    });
  }

  hideOrShowDoneTodos(e: MatCheckboxChange): void {
    if (e.checked) {
      this.hideDoneTodos();
    } else {
      this.showAllTodos();
    }
  }

  hideDoneTodos(): void {
    this.todos.update(oldTodos => {
      const newTodos = oldTodos.filter(todo => todo.status !== 'done');
      return newTodos;
    });
  }

  orderByPriority(e: MatCheckboxChange): void {
    if (e.checked) {
      this.todos.update(oldTodos => {
        const sortedTodos = oldTodos.sort((a, b) => {
          if (Number(a.priority) < Number(b.priority)) {
            return -1;
          }
          return 1;
        });
        return sortedTodos;
      });
    } else {
      this.todos.update(oldTodos => {
        const sortedTodos = oldTodos.sort((a, b) => {
          if (Number(a.priority) < Number(b.priority)) {
            return 1;
          } else if (Number(a.priority) > Number(b.priority)) {
            return -1;
          } else {
            return 0;
          }
        });
        return sortedTodos;
      });
    }
  }

  showAllTodos(): void {
    this.todos.set(this.todoService.todos());
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }
}
