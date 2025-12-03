package com.example.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Registeration {

    private Long id;
    private String fullname;
    private String email;
    private String password;
    private String username;
    private String rolename;
    private String company;
    private String gender;
    private Long number;
    private int age;
}
