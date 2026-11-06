import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TodoClient } from '../../todo-client';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatTimepickerModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  selector: 'app-new-todo',
  styleUrl: './new-todo.css',
  templateUrl: './new-todo.html',
})
export class NewTodo {
  todoService = inject(TodoClient);
  router = inject(Router);
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    priority: new FormControl('1', [Validators.required, Validators.min(1), Validators.max(3)]),
    deadlineTime: new FormControl(''),
    deadlineDate: new FormControl(''),
  });
  photosInput = viewChild.required<ElementRef<HTMLInputElement>>('todoPhotos');
  errorMessage = signal('');

  submitForm() {
    const todoData = new FormData();
    const { title, content, priority, deadlineDate, deadlineTime } = this.form.value;
    if (!title) {
      this.errorMessage.set('Title is required');
      return;
    }
    if (!content) {
      this.errorMessage.set('Content is required');
      return;
    }
    if (!priority) {
      this.errorMessage.set('Priority is required');
      return;
    }
    let deadline: Date | undefined;
    if (deadlineDate && deadlineTime) {
      const date = new Date(deadlineDate);
      const time = new Date(deadlineTime);
      time.setDate(date.getDate())
      time.setMonth(date.getMonth())
      time.setFullYear(date.getFullYear())
      deadline = time;
    } else if (deadlineDate && !deadlineTime) {
      const date = new Date(deadlineDate);
      deadline = date;
    } else {
      if (deadlineTime) {
        const time = new Date(deadlineTime);
        deadline = time;
      }
    }

    const photos = this.photosInput().nativeElement.files;

    todoData.append('title', title);
    todoData.append('content', content);
    todoData.append('priority', priority);
    if (deadline) {
      todoData.append('deadline', deadline.toISOString())
    }
    if (photos && photos.length) {
      for (const photo of photos) {
        todoData.append('todo-photos', photo)
      }
    }

    // send
    this.todoService.createTodo(todoData).subscribe({
      complete: () => this.router.navigate(['home'])
    })
  }
}
