package com.programming.techie.springngblog.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminGetUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminGetUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;

import java.util.List;

@Service
public class CognitoUserDetailsService implements UserDetailsService {

    private final CognitoIdentityProviderClient cognitoClient;

    public CognitoUserDetailsService() {
        this.cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.AP_SOUTHEAST_2) // Replace with your AWS region
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create("", "")))
                .build();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminGetUserResponse response = cognitoClient.adminGetUser(AdminGetUserRequest.builder()
                .userPoolId("ap-southeast-2_RoZXYjc5I")
                .username(username)
                .build());

        List<AttributeType> attributes = response.userAttributes();

        String email = "";
        for (AttributeType attribute : attributes) {
            if ("email".equals(attribute.name())) {
                email = attribute.value();
                break;
            }
        }

        return User.builder()
                .username(username)
                .password("") // Cognito doesn't provide the password here, set it to an empty string
                .roles() // No roles assigned for simplicity
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
