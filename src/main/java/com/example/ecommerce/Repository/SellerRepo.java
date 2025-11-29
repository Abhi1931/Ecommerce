package com.example.ecommerce.Repository;

import com.example.ecommerce.Entity.Sellerdata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SellerRepo extends JpaRepository<Sellerdata,Long> {

     Sellerdata findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
