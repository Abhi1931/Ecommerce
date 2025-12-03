package com.example.ecommerce;
import com.example.ecommerce.Entity.Sellerdata;
import com.example.ecommerce.Repository.SellerRepo;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;



public class PasswordUpdater {

    public static void main(String[] args) {
        // Create a manual Spring context without full boot
        ApplicationContext context = new SpringApplicationBuilder(EcommerceApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);


        // Get beans
        SellerRepo sellerRepo = context.getBean(SellerRepo.class);
        PasswordEncoder encoder = context.getBean(PasswordEncoder.class);

        // Fetch and update
        List<Sellerdata> sellers = sellerRepo.findAll();
        int updatedCount = 0;

        for (Sellerdata seller : sellers) {
            String rawPassword = seller.getPassword();
            if (rawPassword != null &&
                    !(rawPassword.startsWith("$2a$") || rawPassword.startsWith("$2b$") || rawPassword.startsWith("$2y$"))) {

                seller.setPassword(encoder.encode(rawPassword));
                updatedCount++;
                System.out.println("Updated password for: " + seller.getEmail());
            }
        }

        if (updatedCount > 0) {
            sellerRepo.saveAll(sellers);
            System.out.println("🔒 Passwords updated for " + updatedCount + " sellers.");
        } else {
            System.out.println("👌 All seller passwords are already encoded.");
        }
    }
}