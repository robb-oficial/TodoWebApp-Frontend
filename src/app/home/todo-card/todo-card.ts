import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TodoClient } from '../../todo-client';

@Component({
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  selector: 'app-todo-card',
  styleUrl: './todo-card.css',
  templateUrl: './todo-card.html',
})
export class TodoCard {
  todo = input.required<Todo>();
  todoService = inject(TodoClient);
  doneClicked = output();

  markTodoAsDone(): void {
    this.todoService.markTodoAsDone(this.todo().id.toString()).subscribe({
      complete: () => this.doneClicked.emit()
    });
  }
}
