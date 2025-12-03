package com.example.ecommerce.Repository;

import com.example.ecommerce.DTO.Login;
import com.example.ecommerce.Entity.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserData,Long> {
Optional<UserData> findByFullname(String Fullname);

UserData findByUsername(String Username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    Login findByEmail(String email);

}
