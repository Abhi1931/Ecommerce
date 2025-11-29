package com.example.ecommerce.Service.Implementations;

import com.example.ecommerce.DTO.Login;
import com.example.ecommerce.DTO.Registeration;
import com.example.ecommerce.Entity.Role;
import com.example.ecommerce.Entity.Sellerdata;
import com.example.ecommerce.Entity.UserData;
import com.example.ecommerce.Repository.RoleRepo;
import com.example.ecommerce.Repository.SellerRepo;
import com.example.ecommerce.Repository.UserRepository;
import com.example.ecommerce.Service.LsRservice;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
@Service
public class LRserviceImpl implements LsRservice {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final MyUserDetailsService myUserDetailsService;
    private final SellerRepo sellerRepo;
    private final JWTservice jwtService;
    private final RoleRepo roleRepo;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public LRserviceImpl(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            MyUserDetailsService myUserDetailsService,
            JWTservice jwtService,
            RoleRepo roleRepo,
            SellerRepo sellerRepo
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.myUserDetailsService = myUserDetailsService;
        this.jwtService = jwtService;
        this.roleRepo = roleRepo;
        this.sellerRepo =sellerRepo;
    }

    @Override
    public Map<String, String> Login(Login login, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(login.getUsername(), login.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String accessToken = jwtService.token(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(Duration.ofDays(7))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        return tokens;
    }

    @Override
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(401).body("No refresh token");
        }
        String refreshToken = null;
        for (Cookie cookie : cookies) {
            if ("refreshToken".equals(cookie.getName())) {
                 refreshToken = cookie.getValue();
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token missing");
        }

        if (!jwtService.isTokenValid(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }

        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);
        String newAccessToken = jwtService.token(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        return ResponseEntity.ok(response);
    }

    @Override
    public String CustomerRegisteration(Registeration register) {
        if (userRepository.findByUsername(register.getUsername()) != null) {
            return "Username already exists";
        }

        UserData user = new UserData();
        user.setUsername(register.getUsername());
        user.setPassword(passwordEncoder.encode(register.getPassword()));
        user.setEmail(register.getEmail());
        user.setFullname(register.getFullname());

        Role role = roleRepo.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        user.setRole(role);
        userRepository.save(user);

        return "Success";
    }

    @Override
    public ResponseEntity<String> SellerRegisteration(Registeration registers) {
        if (sellerRepo.findByUsername(registers.getUsername()) != null) {
            return new ResponseEntity<>("username already exists",HttpStatus.CONFLICT);
        }

        Sellerdata user = new Sellerdata();
        user.setUsername(registers.getUsername());
        user.setPassword(passwordEncoder.encode(registers.getPassword()));
        user.setEmail(registers.getEmail());
        user.setName(registers.getFullname());
        user.setCompany(registers.getCompany());
        user.setGender(registers.getGender());
        user.setNumber(registers.getNumber());
        user.setAge(registers.getAge());
        sellerRepo.save(user);
        if (sellerRepo.findByUsername(registers.getUsername()).getUsername().equals(registers.getUsername())) {
            return new ResponseEntity<>("saved",HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("not saved",HttpStatus.CONFLICT);
        }
    }

}