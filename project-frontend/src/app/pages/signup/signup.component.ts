import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ROUTES } from 'src/app/constants/routes.constants';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  constructor(private toastr: ToastrService, private authService: AuthService) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)])
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const user = this.signupForm.value;
      this.authService.signup(user);
    } else {
      if (this.signupForm.get('username')?.hasError('required')) {
        this.toastr.error('Username is required', 'Error');
      }
      if (this.signupForm.get('email')?.hasError('required')) {
        this.toastr.error('Email is required', 'Error');
      } else if (this.signupForm.get('email')?.hasError('email')) {
        this.toastr.error('Invalid email format', 'Error');
      }
      if (this.signupForm.get('password')?.hasError('required')) {
        this.toastr.error('Password is required', 'Error');
      } else if (this.signupForm.get('password')?.hasError('pattern')) {
        this.toastr.error('Password should contain at least 1 number, 1 special character, 1 uppercase and lowercase letter, and be at least 8 characters long', 'Error');
      }
    }
  }
}
