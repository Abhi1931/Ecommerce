package com.example.ecommerce.Repository;

import com.example.ecommerce.Entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<Cart,Long> {

    List<Cart> findByUserId(Long user_id);
    Optional<Cart> findByUserIdAndProductPid(Long user_id, Long product_id);
    void deleteByUserId(Long user_id);
}
