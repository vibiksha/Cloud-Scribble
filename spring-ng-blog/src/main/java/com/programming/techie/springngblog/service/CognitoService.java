package com.programming.techie.springngblog.service;


import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserStatusType;

@Service
public class CognitoService {

    private final CognitoIdentityProviderClient cognitoClient;

    @Value("${aws.cognito.userPoolId}")
    private String USER_POOL_ID;

    @Value("${aws.accessKeyId}")
    private String ACCESS_KEY_ID;

    @Value("${aws.secretAccessKey}")
    private String SECRET_ACCESS_KEY;

    public CognitoService() {
        this.cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.AP_SOUTHEAST_2) // Replace with your AWS region
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create("", "")))
                .build();
    }

    public AdminCreateUserResponse createCognitoUser(String username, String email, String password) {
        AdminCreateUserRequest createUserRequest = AdminCreateUserRequest.builder()
                .userPoolId(USER_POOL_ID)
                .username(email)
                .userAttributes(
                        AttributeType.builder().name("email").value(email).build(),
                        AttributeType.builder().name("preferred_username").value(username).build(),
                        AttributeType.builder().name("email_verified").value("true").build()
                )
                .messageAction(MessageActionType.SUPPRESS) // Avoid sending a confirmation message
                .build();

        AdminCreateUserResponse createUserResponse = cognitoClient.adminCreateUser(createUserRequest);

        // Set user password to a permanent one to confirm the user
        AdminSetUserPasswordRequest setUserPasswordRequest = AdminSetUserPasswordRequest.builder()
                .userPoolId(USER_POOL_ID)
                .username(email)
                .password(password)
                .permanent(true)
                .build();

        AdminSetUserPasswordResponse setUserPasswordResponse = cognitoClient.adminSetUserPassword(setUserPasswordRequest);

        return createUserResponse;
    }
}
