package com.example.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerDTO {
    private Long sid;

    private String name;

    private String company;

    private int age;

    private String username;

    private String password;

    private String email;

    private String gender;

    private Long number;


}
