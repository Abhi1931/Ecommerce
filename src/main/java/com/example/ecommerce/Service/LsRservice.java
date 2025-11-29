package com.example.ecommerce.Service;

import com.example.ecommerce.DTO.Login;
import com.example.ecommerce.DTO.Registeration;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface LsRservice {


    ResponseEntity<?> refreshAccessToken(HttpServletRequest request);

    String CustomerRegisteration(Registeration register);

    ResponseEntity<String> SellerRegisteration(Registeration register);

    Map<String, String> Login(Login login, HttpServletResponse response);
}
