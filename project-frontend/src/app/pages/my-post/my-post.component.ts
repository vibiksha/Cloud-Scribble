import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-my-post',
  templateUrl: './my-post.component.html',
  styleUrls: ['./my-post.component.scss']
})
export class MyPostComponent implements OnInit {

  posts: any[] = [];

  constructor(private userService: UserService,
    private toastr: ToastrService) { }

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
}
