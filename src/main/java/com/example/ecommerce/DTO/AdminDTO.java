package com.example.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {

    private Long Id;

    private String email;

    private   String fullname;

    private String password;

    private String username;


    private String role;


}
