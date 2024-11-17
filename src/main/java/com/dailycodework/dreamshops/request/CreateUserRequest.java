package com.dailycodework.dreamshops.request;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String lastName;
    private String firstName;
    private String userName;
    private String email;
    private String password;
}
