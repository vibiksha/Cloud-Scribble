import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { ToastrService } from 'ngx-toastr';
import { BACKEND_ROUTES, ROUTES } from 'src/app/constants/routes.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserInfo;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http:HttpClient,
    private router:Router,
    private toastr: ToastrService) {
  }

  getJwtToken(): Promise<string> {
    return Auth.currentSession()
      .then((res) => {
        const idToken = res.getIdToken()?.getJwtToken();
        // console.log(idToken)
        return idToken;
      })
      .catch((error) => {
        console.error('Error getting JWT token:', error);
        throw error;
      });
  }

  signup(signupData: any) {
    this.http.post(BACKEND_ROUTES.SIGNUP, signupData, { responseType: 'text' }).subscribe(
      (response) => {
        // console.log(response)
        this.router.navigate([ROUTES.LOGIN])
      },
      (error) => {
        this.toastr.error(error.message);
    if (error.status === 400) {
      this.toastr.error('Username or email already exists', 'Error');
    } else {
      this.toastr.error('Error during signup');
    }
      }
    );
  }

  signIn(username: string, password: string): Promise<any> {
    return Auth.signIn(username, password);
  }
  signOut(): Promise<any> {
    return Auth.signOut();

  }
  async getUser(): Promise<any> {
    if (!this.currentUserInfo) {
      this.currentUserInfo = await Auth.currentUserInfo();
      // console.log(this.currentUserInfo);
    }
    return this.currentUserInfo;
  }
  async getUsernameFromSession() {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      return currentUser.attributes.preferred_username;
    } catch (error) {
      // console.error('Error fetching username from session:', error);
      throw error;
    }
  }
  forgotPassword(username: string): Promise<void> {
    return Auth.forgotPassword(username);
  }


  forgotPasswordSubmit(username: string, code: string, newPassword: string): Promise<string> {
    return Auth.forgotPasswordSubmit(username, code, newPassword);
  }
  clearCurrentUser()
  {
    this.currentUserInfo=null;
  }
}
