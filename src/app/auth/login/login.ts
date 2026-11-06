import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../auth';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  authService = inject(Auth);
  router = inject(Router);
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  errorMessage = signal('');

  onSubmit() {
    const { username, password } = this.loginForm.value;
    if (!username || !password) {
      this.errorMessage.set('One or more fields are missing');
      return;
    }
    this.errorMessage.set('');

    const data = { username, password };

    this.authService.login(data).subscribe({
      complete: () => {
        this.authService.checkSession().subscribe({
          next: (res: any) => {
            this.authService.user.set(res.data.user);
            this.router.navigate(['home']);
          }
        });
      },
      error: (err) => {
        this.errorMessage.set(err.error.message)
      }
    });
  }
}
