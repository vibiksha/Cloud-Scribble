import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ROUTES } from 'src/app/constants/routes.constants';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(
    private authService:AuthService,
    private toastr: ToastrService,

    private router:Router) { }

    async ngOnInit(){
      this.initForm();
   await this.checkLoggedInUser();

  }
  async checkLoggedInUser(): Promise<void> {
    try {
      const loggedInUser = await this.authService.getUser();
      if (loggedInUser) {
        this.router.navigate([ROUTES.DASHBOARD]);
      }
    } catch (err) {
      // console.log(err);
      this.toastr.error('Error checking user status. Please try again later.');

    }
  }
initForm()
{
  this.loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
}
  onSubmit(): void {

      const  email= this.loginForm.value.email;
      const  password= this.loginForm.value.password;

    if (this.loginForm.valid )
    {
      this.authService
      .signIn(email, password)
      .then(async (data) => {
        // console.log(data)
        this.router.navigate([ROUTES.DASHBOARD]);
      })
      .catch((err) => {
        if (err.message === 'EMAIL_NOT_FOUND') {
          this.toastr.error('Email not found. Please check your email.');
        } else if (err.message === 'INVALID_PASSWORD') {
          this.toastr.error('Invalid password. Please try again.');
        } else {
          this.toastr.error('Error signing in. Please try again later.');
        }
      });
    }else {

      if (this.loginForm.get('email')?.hasError('required')) {
        this.toastr.error('Email is required', 'Error');
      } else if (this.loginForm.get('email')?.hasError('email')) {
        this.toastr.error('Invalid email format', 'Error');
      }
      if (this.loginForm.get('password')?.hasError('required')) {
        this.toastr.error('Password is required', 'Error');
      } else if (this.loginForm.get('password')?.hasError('pattern')) {
        this.toastr.error('Password should contain at least 1 number, 1 special character, 1 uppercase and lowercase letter, and be at least 8 characters long', 'Error');
      }
    }


  }
}
