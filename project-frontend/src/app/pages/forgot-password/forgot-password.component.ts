import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ROUTES } from 'src/app/constants/routes.constants';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;
  confirmationCodeForm!: FormGroup;
  showConfirmationCode: boolean = false;
  showNewPassword: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService,private router:Router,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email])
    });

    this.confirmationCodeForm = new FormGroup({
      code: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    this.loading = true;

    if (!this.showConfirmationCode) {
      const { username } = this.forgotPasswordForm.value;

      this.authService.forgotPassword(username)
        .then(() => {
          this.showConfirmationCode = true;
          this.loading = false;
        })
        .catch((err) => {
          // console.error('Forgot Password Error:', err);
          this.toastr.error(err.message);
          this.loading = false;
        });
    } else if (!this.showNewPassword) {
      const { code, newPassword } = this.confirmationCodeForm.value;

      this.authService.forgotPasswordSubmit(this.forgotPasswordForm.value.username, code, newPassword)
        .then((response) => {
          if (response === 'SUCCESS') {
            this.showNewPassword = true;
            this.router.navigate([ROUTES.LOGIN])

          } else {
            this.toastr.error(response);
          }
          this.loading = false;
        })
        .catch((err) => {
          // console.error('Password Reset Error:', err);
          this.toastr.error(err.message);
          this.loading = false;
        });
    }
  }

}
