package com.example.ecommerce.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sellerdata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sid;

    private String name;

    @Column(unique = true)
    private String username;

    private String password;

    private String company;

    private int age;

    private String email;

    private String gender;

    private Long number;

    @JsonIgnore
    @ManyToMany
    @JoinTable(name ="seller_products",
            joinColumns = @JoinColumn(name = "seller_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    private Set<Products> products;

    @Transient
    private RoleType getRole(){
              return RoleType.SELLER;
    }


}
