import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ROUTES } from 'src/app/constants/routes.constants';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  posts: any[] = [];
  isMyPostsActive: boolean = true;

  constructor(private userService: UserService,
    private toastr: ToastrService,
    private router:Router) { }

  ngOnInit(): void {
    this.loadPost();
    this.userService.newPost.subscribe(() => {
      this.loadPost();
    });

  }

  async loadPost() {
    try {
      const data = await this.userService.getPostsByUsername();
      this.posts = data;
    } catch (error) {
      this.toastr.error(error.message);

    }
  }

  viewMyPosts(){
    this.router.navigate([ROUTES.MYPOST]);
    this.isMyPostsActive = true;

  }
  viewAllPosts(){
    this.router.navigate([ROUTES.ALLPOST]);
    this.isMyPostsActive = false;

  }
}
