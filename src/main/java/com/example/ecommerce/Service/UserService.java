package com.example.ecommerce.Service;


import com.example.ecommerce.DTO.UserDTO;

public interface UserService {

    UserDTO GetUserById(Long id);

    String UpdateUserById(UserDTO userDTO, Long id);

    String deleteUserById(Long id);
}
