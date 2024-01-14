package com.programming.techie.springngblog.controller;

import com.programming.techie.springngblog.model.Post;
import com.programming.techie.springngblog.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:4200")

public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createPost(@Valid @RequestBody Post post) {
        System.out.println("Received Post Data: " + post.getTitle());
        Post createdPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body("Post created with ID: " + createdPost.getId());
    }
    @GetMapping("/{username}")
    public ResponseEntity<List<Post>> getPostsByUsername(@PathVariable String username) {
        List<Post> posts = postService.getAllPostsByUsername(username);

        if(posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(posts);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();

        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(posts);
    }
    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deletePostById(@PathVariable Long id) {
        if (postService.deletePostById(id)) {
            return ResponseEntity.ok("Post deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
        }
    }
    @PutMapping("update/{postId}")
    public ResponseEntity<Post> updatePost(@PathVariable Long postId, @RequestBody Post updatedPost) {
        Post existingPost = postService.getPostById(postId);

        if (existingPost == null) {
            return ResponseEntity.notFound().build();
        }

        // Update the fields you want from the updatedPost
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());

        // Save the updated post
        Post savedPost = postService.updatePost(existingPost);
        return ResponseEntity.ok(savedPost);
    }

}