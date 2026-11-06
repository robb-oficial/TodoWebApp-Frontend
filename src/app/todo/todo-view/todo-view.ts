import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TodoClient } from '../../todo-client';
import { single } from 'rxjs';
import { MatAnchor } from '@angular/material/button';
import { environment } from '../../../environments/environment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [MatAnchor, RouterLink],
  selector: 'app-todo-view',
  styleUrl: './todo-view.css',
  templateUrl: './todo-view.html',
})
export class TodoView implements OnInit {
  brkPntService = inject(BreakpointObserver);
  todoService = inject(TodoClient);
  router = inject(Router);
  smallScreen = signal(false);
  id = input.required<string>();
  todo = signal<Todo | undefined>(undefined);
  photos = signal<Photo[]>([]);
  staticFilesUrl = environment.staticFilesUrl;
  isDone = signal(false);

  ngOnInit(): void {
    this.todoService.getTodo(this.id()).subscribe({
      next: (res) => {
        const resTodo = res.data.todo;
        resTodo.createdAt = new Date(res.data.todo.created_at);
        delete resTodo.created_at;
        if (resTodo.deadline) {
          resTodo.deadline = new Date(resTodo.deadline);
        }
        this.todo.set(res.data.todo);
        this.isDone.set(this.todo()?.status === 'done');
        if (res.data.photos) {
          this.photos.set(res.data.photos);
        }
      }
    });

    this.brkPntService.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.smallScreen.set(false);
      if (result.matches) {
        this.smallScreen.set(true);
      }
    });
  }

  markAsDone(): void {
    this.todoService.markTodoAsDone(this.id()).subscribe({
      complete: () => this.router.navigate(['home'])
    });
  }

  deleteTodo(): void {
    this.todoService.deleteTodo(this.id()).subscribe({
      complete: () => this.router.navigate(['home'])
    })
  }
}
