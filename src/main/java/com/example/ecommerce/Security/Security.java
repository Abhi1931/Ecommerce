package com.example.ecommerce.Security;

import com.example.ecommerce.Entity.Role;
import com.example.ecommerce.Entity.UserData;
import com.example.ecommerce.Repository.RoleRepo;
import com.example.ecommerce.Repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/essentials")
public class Security  {

    @GetMapping("/csrf")
    public CsrfToken getCsrfToken(HttpServletRequest request){
  return (CsrfToken) request.getAttribute("_csrf");
    }

    @Bean
    public CommandLineRunner createDefaultAdmin(UserRepository userRepository, RoleRepo roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            String defaultUsername = "Abhi";
            String defaultPassword = "abhi@123";
            String defaultRole = "ADMIN";

            Role adminRole = roleRepository.findByRoleName(defaultRole)
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setRoleName(defaultRole);
                        return roleRepository.save(newRole);
                    });

            if (!userRepository.existsByUsername(defaultUsername)) {
                UserData admin = new UserData();
                admin.setFullname("Abhich");
                admin.setEmail("abhi@gmail.com");
                admin.setUsername(defaultUsername);
                admin.setPassword(passwordEncoder.encode(defaultPassword));
                admin.setRole(adminRole);
                userRepository.save(admin);
                System.out.println("🟢 Default admin created: " + defaultUsername);
            } else {
                System.out.println("ℹ Default admin already exists.");
            }
        };
    }


}
