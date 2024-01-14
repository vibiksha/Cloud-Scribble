package com.programming.techie.springngblog.service;


import com.programming.techie.springngblog.model.Post;
import com.programming.techie.springngblog.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Autowired
    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public Post createPost(Post post) {
        post.setCreatedOn(Instant.now());
        return postRepository.save(post);
    }
    public List<Post> getAllPostsByUsername(String username) {
        return postRepository.findByUsername(username);
    }
    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public boolean deletePostById(Long id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }
    @Override
    public Post getPostById(Long id) {
        return postRepository.findById(id).orElse(null);
    }
    public Post updatePost(Post post) {
        // Assuming PostRepository has a save method that handles both creation and update
        return postRepository.save(post);
    }
}
