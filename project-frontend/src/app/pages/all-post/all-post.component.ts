import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.scss']
})
export class AllPostComponent implements OnInit {

  posts: any[] = [];

  constructor(private userService: UserService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadPost();
    this.userService.newPost.subscribe(() => {
      this.loadPost();
    });

  }
   loadPost() {
    this.userService.getAllPosts().subscribe((data: any[]) => {
      this.posts = data;
    });
  }
}
