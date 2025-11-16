package com.example.ecommerce.Service.Implementations;

import com.example.ecommerce.DTO.UserDTO;
import com.example.ecommerce.Entity.UserData;
import com.example.ecommerce.Mapper.UserMapper;
import com.example.ecommerce.Repository.UserRepository;
import com.example.ecommerce.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper  userMapper;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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
        userData.setUsername(userDTO.getUsername());
        userData.setEmail(userDTO.getEmail());
        userData.setFullname(userDTO.getFullname());
        userData.setId(id);
        userData.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        UserData user = userRepository.save(userData);
       if (user == userData){
           return "Not updated";
       }
       else{
           return "Updated Successfully";
       }
    }
    @Override
    public String deleteUserById(Long id) {
                userRepository.deleteById(id);
                return  "Account deleted successfully";
    }
}
