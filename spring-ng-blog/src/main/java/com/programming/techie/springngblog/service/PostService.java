package com.programming.techie.springngblog.service;


import com.programming.techie.springngblog.model.Post;

import java.util.List;

public interface PostService {
    Post createPost(Post post);
    List<Post> getAllPostsByUsername(String username);
    List<Post> getAllPosts();
    boolean deletePostById(Long id);
    Post updatePost(Post post);
    Post getPostById(Long id);



}