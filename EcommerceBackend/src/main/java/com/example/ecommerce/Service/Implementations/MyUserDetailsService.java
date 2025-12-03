package com.example.ecommerce.Service.Implementations;

import com.example.ecommerce.Entity.Sellerdata;
import com.example.ecommerce.Entity.UserData;
import com.example.ecommerce.Repository.SellerRepo;
import com.example.ecommerce.Repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {


    private final UserRepository userRepository;
    private final SellerRepo sellerRepo;

    public MyUserDetailsService(UserRepository userRepository,SellerRepo sellerRepo) {
        this.userRepository = userRepository;
        this.sellerRepo = sellerRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserData userData = userRepository.findByUsername(username);

        Sellerdata sellerdata = sellerRepo.findByUsername(username);
        if (userData == null) {
            return new UserPrincipal(sellerdata);
        } else if (sellerdata == null) {
            return new UserPrincipal(userData);
        }
        else {
            throw new UsernameNotFoundException("user not found");
        }


    }
    }

