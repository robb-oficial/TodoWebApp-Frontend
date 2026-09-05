import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Auth } from '../auth';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAnchor],
  selector: 'app-signup',
  styleUrl: './signup.css',
  templateUrl: './signup.html',
})
export class Signup {
  authService = inject(Auth);
  router = inject(Router);

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    passwordConfirm: new FormControl('', [Validators.required])
  });
  fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  errorMessage = signal('');

  onSubmit() {
    const formData = new FormData();
    const { username, email, password, passwordConfirm } = this.form.value;
    if (!username || !email || !password || !passwordConfirm) {
      this.errorMessage.set('One or more required values missing');
      return;
    }
    if (password !== passwordConfirm) {
      this.errorMessage.set('Passwords do not match');
      return;
    }
    if (this.form.invalid) {
      this.errorMessage.set('Check your data again');
      return;
    }

    this.errorMessage.set('')
    const data = {
      username,
      email,
      password,
      passwordConfirm
    }

    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('passwordConfirm', passwordConfirm)

    const file = this.fileInput().nativeElement.files?.item(0);
    if (file) {
      formData.append('profile-pic', file);
    }

    this.authService.signup(formData).subscribe({
      complete: () => this.router.navigate(['login']),
      error: (err) => this.errorMessage.set(err.error.message)
    });
  }
}
