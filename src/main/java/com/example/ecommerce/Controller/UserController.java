package com.example.ecommerce.Controller;

import com.example.ecommerce.DTO.UserDTO;
import com.example.ecommerce.Service.LsRservice;
import com.example.ecommerce.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/essentials/user")
public class UserController {

    private final LsRservice lsRservice;
    private final UserService userService;

    public UserController(LsRservice lsRservice, UserService userService) {
        this.lsRservice = lsRservice;
        this.userService = userService;
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        return lsRservice.refreshAccessToken(request);
    }

    @GetMapping("/profile/{id}")
    public UserDTO GetUserById(@PathVariable("id") Long id){
        return userService.GetUserById(id);
    }

    @DeleteMapping("/profile/{id}")
    public String DeleteUserById(@PathVariable("id") Long id){
        return userService.deleteUserById(id);
    }

    @PutMapping("/profile/{id}")
    public String UpdateUserById(@RequestBody UserDTO userDTO, @PathVariable("id") Long id){
        return userService.UpdateUserById(userDTO,id);
    }
}
