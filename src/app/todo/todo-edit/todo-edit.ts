import { Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { TodoClient } from '../../todo-client';
import { Router } from '@angular/router';

@Component({
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  providers: [provideNativeDateAdapter()],
  selector: 'app-todo-edit',
  styleUrl: './todo-edit.css',
  templateUrl: './todo-edit.html',
})
export class TodoEdit implements OnInit {
  todoService = inject(TodoClient);
  router = inject(Router);
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    deadlineTime: new FormControl(),
    deadlineDate: new FormControl()
  });
  id = input.required<string>();
  photosInput = viewChild.required<ElementRef<HTMLInputElement>>('todoPhotos')
  todo = signal<Todo | undefined>(undefined);
  errorMessage = signal('')

  ngOnInit(): void {
    this.todoService.getTodo(this.id()).subscribe((res) => {
      const resTodo = res.data.todo;
      resTodo.createdAt = new Date(res.data.todo.created_at);
      delete resTodo.created_at;
      if (resTodo.deadline) {
        resTodo.deadline = new Date(resTodo.deadline);
      }
      this.todo.set(res.data.todo);

      this.patchForm(this.todo());
    });

  }

  patchForm(todo: Todo | undefined): void {
    if (!todo) {
      return;
    }
    this.form.controls.title.patchValue(todo.title);
    this.form.controls.content.patchValue(todo.content);
    this.form.controls.priority.patchValue(todo.priority.toString());
    if (todo.deadline) {
      this.form.controls.deadlineDate.patchValue(new Date(todo.deadline));
      this.form.controls.deadlineTime.patchValue(new Date(todo.deadline));
    }
  }

  submitForm(): void {
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
      date.setSeconds(0);
      date.setMinutes(0);
      date.setHours(0);
      deadline = date;
    } else {
      if (deadlineTime) {
        const today = new Date();
        const time = new Date(deadlineTime);
        time.setDate(today.getDate());
        time.setMonth(today.getMonth());
        time.setFullYear(today.getFullYear());
        deadline = time;
      }
    }

    const photos = this.photosInput().nativeElement.files;

    todoData.append('title', title);
    todoData.append('content', content);
    todoData.append('priority', priority);
    if (deadline) {
      todoData.append('deadline', deadline.toISOString());
    }
    if (photos && photos.length) {
      for (const photo of photos) {
        todoData.append('todo-photos', photo);
      }
    }

    this.todoService.editTodo(this.id(), todoData).subscribe({
      complete: () => this.router.navigate(['/todo', this.id()])
    })
  }
}
