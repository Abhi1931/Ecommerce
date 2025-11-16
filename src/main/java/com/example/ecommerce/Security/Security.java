package com.example.ecommerce.Security;

import jakarta.servlet.http.HttpServletRequest;
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
}
