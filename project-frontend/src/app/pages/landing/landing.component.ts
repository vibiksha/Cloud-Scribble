import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  posts: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadPost();
    this.userService.newPost.subscribe(() => {
      this.loadPost();
    });

  }
  loadPost()
  {
    this.userService.getAllPosts().subscribe((data: any[]) => {
      this.posts = data;
    });
  }

}
