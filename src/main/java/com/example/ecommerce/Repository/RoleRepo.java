package com.example.ecommerce.Repository;

import com.example.ecommerce.Entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<Role,Integer> {


    Optional<Role> findByRoleName(String roleName);
}
