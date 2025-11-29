package com.example.ecommerce.Service;

import com.example.ecommerce.EcommerceApplication;

import com.example.ecommerce.Entity.UserData;

import com.example.ecommerce.Repository.UserRepository;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

public class PaswwordUpdaterUser {

    public static void main(String[] args) {

        ApplicationContext context = new SpringApplicationBuilder(EcommerceApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);

        UserRepository userRepo = context.getBean(UserRepository.class);
        PasswordEncoder encoder = context.getBean(PasswordEncoder.class);

        List<UserData> users = userRepo.findAll();
        int updatedCount = 0;

        for (UserData user : users) {
            String rawPassword = user.getPassword();
            if (rawPassword != null &&
                    !(rawPassword.startsWith("$2a$") || rawPassword.startsWith("$2b$") || rawPassword.startsWith("$2y$"))) {

                user.setPassword(encoder.encode(rawPassword));
                updatedCount++;
                System.out.println("Updated password for: " + user.getEmail());
            }
        }

        if (updatedCount > 0) {
            userRepo.saveAll(users);
            System.out.println("🔒 Passwords updated for " + updatedCount + " users.");
        } else {
            System.out.println("👌 All users passwords are already encoded.");
        }
    }
}
