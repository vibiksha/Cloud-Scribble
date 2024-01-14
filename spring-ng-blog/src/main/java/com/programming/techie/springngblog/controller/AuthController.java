package com.programming.techie.springngblog.controller;
import com.programming.techie.springngblog.dto.SignupRequest;
import com.programming.techie.springngblog.service.CognitoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserResponse;

@RestController

@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
//@CrossOrigin(origins = "http://blog-writing-application.s3-website-ap-southeast-2.amazonaws.com")

public class AuthController {

    private final CognitoService cognitoService;

    public AuthController(CognitoService cognitoService) {
        this.cognitoService = cognitoService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        try {
            AdminCreateUserResponse response = cognitoService.createCognitoUser(signupRequest.getUsername(), signupRequest.getEmail(), signupRequest.getPassword());
            // Handle successful signup
            return ResponseEntity.ok("User created successfully");
        } catch (Exception e) {
            // Handle errors gracefully
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}