package com.example.ecommerce.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class UserData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(unique = true)
    public String username;

    @Email
    @Column(unique = true)
    public String email;

    @Column
    public String password;

    @Column
    public String fullname;


    @ManyToOne
    @JoinColumn(name = "user_role")
    private Role role;

}
