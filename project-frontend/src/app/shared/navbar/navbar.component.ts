import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ROUTES } from 'src/app/constants/routes.constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  addPostForm: FormGroup;
  public editorConfig: Object = {
    charCounterMax: 50000,
  };
  content: string = '';
  constructor(private userService:UserService,
    private authService:AuthService,
    private router:Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {

    this.addPostForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
this.viewMyPosts();
  }
  showUserModal = false;
  showAddImageModal = false;
  isTabMenuOpen=false;
  onContentChanged(eventContent: string): void {
    this.addPostForm.controls['content'].setValue(eventContent);
  }
  async addPost() {
    if (this.addPostForm.valid) {
      const formData = this.addPostForm.value;
      formData.username=await this.authService.getUsernameFromSession();
      // formData.username="vibiksha"
      // console.log(formData)
      this.userService.createPost(formData) .subscribe(
        (response) => {

          // console.log('Post created successfully:');
          this.showAddImageModal=false
          this.addPostForm.reset();
          this.content='';
          this.toastr.success("Post created successfully");


        },
        (error) => {
          // console.error('Error creating post:', error);
          this.toastr.error(error.message);

        }
      );
    }
  }
cancel()
{
  this.showAddImageModal=false
}
  toggleUserModal(): void {
    this.showUserModal = !this.showUserModal;
  }

  togglePlusModal(): void {
    this.showAddImageModal = !this.showAddImageModal;
  }
  toggleTabMenu()
  {
    this.isTabMenuOpen=!this.isTabMenuOpen
  }
  cancelAddImageModal(): void {
    this.showAddImageModal = false;
  }
  viewMyPosts(){
    this.router.navigate([ROUTES.MYPOST]);
    this.isTabMenuOpen=false;
  }
  viewAllPosts(){
    this.router.navigate([ROUTES.ALLPOST]);
    this.isTabMenuOpen=false;
  }

async logout()
{
   await this.authService.signOut().then(()=>{
    this.authService.clearCurrentUser()
    this.router.navigate([ROUTES.LANDING]);
   });
}

}
