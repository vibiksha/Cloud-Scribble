import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: any={};
  @Input() disableButton:boolean
  showUpdateModel=false;
  showReadMoreModel=false
  addPostForm: FormGroup;
  public editorConfig: Object = {
    charCounterMax: 50000,
  };
  content: string = '';
    constructor(private userService:UserService,
      private toastr: ToastrService,

    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.addPostForm = this.formBuilder.group({
      title: [this.post.title || '', Validators.required],
      content: [this.post.content || '', Validators.required]
    });
    this.content = this.post.content || '';
  }
  deletePost(postId: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.userService.deletePost(postId);
    }
}
showFullContent(post: any): void {
  post.showFull = true;
  this.showReadMoreModel=true

}

showTruncatedContent(post: any): void {
  post.showFull = false;
  this.showReadMoreModel=false
}

getPostContent(post: any): string {
  return post.showFull ? post.content : this.truncateContent(post.content);
}

truncateContent(content: string): string {
  return content.length > 150 ? `${content.slice(0, 150)}...` : content;
}

shouldDisplayReadMore(post: any): boolean {
  return post.content.length > 150;
}
openEditor(post: any): void {
  this.showUpdateModel=true;
  this.showReadMoreModel=false;
 }
 cancel()
 {
  this.showUpdateModel=false;
 }
 onContentChanged(eventContent: string): void {
  this.addPostForm.controls['content'].setValue(eventContent);
}
 updatePost(): void {
  if (this.addPostForm.valid) {
    const postId = this.post.id; // Assuming you have the post ID in your form
    const formData = this.addPostForm.value;

    // Call the UserService method to update the post
    this.userService.updatePost(postId, formData).subscribe(
      (response) => {
        // console.log('Post updated successfully:', response);
        this.showUpdateModel=false
        this.userService.uploadPost();
        this.toastr.success("Post Updated Successfully");

      },
      (error) => {
        // console.error('Error updating post:', error);
        this.toastr.error(error.message);

      }
    );
  }
}
}
