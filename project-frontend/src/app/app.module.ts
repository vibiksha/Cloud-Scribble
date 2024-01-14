import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { LandingComponent } from './pages/landing/landing.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { PostComponent } from './shared/post/post.component';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyPostComponent } from './pages/my-post/my-post.component';
import { AllPostComponent } from './pages/all-post/all-post.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    AuthComponent,
    DashboardComponent,
    NavbarComponent,
    ForgotPasswordComponent,
    LandingComponent,
    PostComponent,
    MyPostComponent,
    AllPostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
   ReactiveFormsModule,
   HttpClientModule,
   CKEditorModule,
   FroalaEditorModule.forRoot(),
  FroalaViewModule.forRoot(),
  BrowserAnimationsModule,
  ToastrModule.forRoot({
    positionClass: 'toast-top-right',
    timeOut: 3000,
    closeButton: true,
    progressBar: true 
  })

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
