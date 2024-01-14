import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of, throwError } from 'rxjs';
import { BACKEND_ROUTES } from 'src/app/constants/routes.constants';
import { Post } from 'src/app/interface/post';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http:HttpClient,
    private authService:AuthService,
    private toastr:ToastrService) {}
  newPost: EventEmitter<string> = new EventEmitter<string>();

  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(BACKEND_ROUTES.DISPLAY_ALL);
  }
  uploadPost(): void {

    this.newPost.emit();
  }
  createPost(post: Post) {
    return this.http.post<Post>(BACKEND_ROUTES.CREATE_POST, post)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 201) {
            this.uploadPost();
            return of(error.error); // Return a success response or necessary data
          } else {
            return throwError(error); // Propagate the error
          }
        })
      );
  }

  async getPostsByUsername() {
    try {
      const username = await this.authService.getUsernameFromSession();
      // console.log(username);
      const response = await this.http.get<any[]>(`${BACKEND_ROUTES.DISPLAY_BY_NAME}/${username}`).toPromise();
      return response;
    } catch (error) {
      // console.error('Error fetching posts by username:', error);
      throw error;
    }
  }
  deletePost(postId: number) {
     this.http.delete<any>(`${BACKEND_ROUTES.DELETE}/${postId}`, { responseType: 'text' as 'json' }).subscribe(
      () => {
        // console.log("Post Deleted Successfully");
        this.uploadPost();
        this.toastr.success("Post Deleted Successfully");

      },
      error => {
        // console.error('Error deleting post:', error);
        this.toastr.success(error.message);

      }
    );
  }
  updatePost(postId: number, postData: any): Observable<any> {
    const url = `${BACKEND_ROUTES.UPDATE}/${postId}`; // Assuming your endpoint for updating a post is like /posts/{postId}
    return this.http.put(url, postData);
  }

}
