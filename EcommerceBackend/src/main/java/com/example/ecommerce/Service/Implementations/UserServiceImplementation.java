package com.example.ecommerce.Service.Implementations;

import com.example.ecommerce.DTO.UserDTO;
import com.example.ecommerce.Entity.UserData;
import com.example.ecommerce.Mapper.OrdersMapper;
import com.example.ecommerce.Mapper.UserMapper;
import com.example.ecommerce.Repository.UserRepository;
import com.example.ecommerce.Security.SecurityConfiguration;
import com.example.ecommerce.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final OrdersMapper ordersMapper;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImplementation(UserMapper userMapper, UserRepository userRepository, OrdersMapper ordersMapper, PasswordEncoder passwordEncoder) {

        this.userMapper = userMapper;
        this.userRepository = userRepository;
        this.ordersMapper = ordersMapper;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public UserDTO GetUserById(Long id) {
        UserDTO userDTO= new UserDTO();
        return userRepository.findById(id).map( userData -> {
           userDTO.setEmail(userData.getEmail());
            userDTO.setPassword(null);
           userDTO.setFullname(userData.getFullname());
           userDTO.setUsername(userData.getUsername());
                    return userDTO;
                }
        ).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Override
    public String UpdateUserById(UserDTO userDTO, Long id) {
        UserData userData = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (userDTO.getUsername() != null &&
                !userDTO.getUsername().equals(userData.getUsername())) {

            if (userRepository.findByUsername(userDTO.getUsername()) != null) {
                return "username already exists";
            }
            userData.setUsername(userDTO.getUsername());
        }

        if (userDTO.getEmail() != null &&
                !userDTO.getEmail().equals(userData.getEmail())) {

            if (userRepository.findByEmail(userDTO.getEmail()) != null) {
                return "email already exists";
            }
            userData.setEmail(userDTO.getEmail());
        }

        if (userDTO.getFullname() != null) {
            userData.setFullname(userDTO.getFullname());
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
            userData.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        userRepository.save(userData);
        return "Updated Successfully";
    }

    @Override
    public String deleteUserById(Long id) {
                userRepository.deleteById(id);
                return  "Account deleted successfully";
    }
}
