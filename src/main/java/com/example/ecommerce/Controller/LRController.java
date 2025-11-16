package com.example.ecommerce.Controller;

import com.example.ecommerce.DTO.Login;
import com.example.ecommerce.DTO.Registeration;
import com.example.ecommerce.Service.LsRservice;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/essentials")
public class LRController {

    private final LsRservice lsRservice;

    public LRController(LsRservice lsRservice) {
        this.lsRservice = lsRservice;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Login login, HttpServletResponse response) {
        Map<String, String> tokens = lsRservice.Login(login, response);
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/register")
    public String register(@RequestBody Registeration register) {
        return lsRservice.Register(register);
    }

    @PostMapping("/registers")
    public ResponseEntity<String> registers(@RequestBody Registeration register) {
        return lsRservice.Registers(register);
    }

}
