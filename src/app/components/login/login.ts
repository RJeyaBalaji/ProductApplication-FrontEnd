import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../service/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm!: FormGroup;
  loginError: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: Auth) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    if (typeof window !== 'undefined') {
      const savedUsername = window.sessionStorage.getItem('savedUsername');
      const savedPassword = window.sessionStorage.getItem('savedPassword');

      if (savedUsername && savedPassword) {
        this.loginForm.patchValue({
          username: savedUsername,
          password: savedPassword,
          rememberMe: true
        });
      }
    }
  }

  onSubmit() {
    const { username, password, rememberMe } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.loginError = false;

        // No need to call setLoggedIn(true), handled inside auth.login()

        if (rememberMe && typeof window !== 'undefined') {
          sessionStorage.setItem('savedUsername', username);
          sessionStorage.setItem('savedPassword', password);
        } else {
          sessionStorage.removeItem('savedUsername');
          sessionStorage.removeItem('savedPassword');
        }

        this.router.navigate(['/products']);
      },
      error: () => {
        this.loginError = true;
      }
    });
  }
}
