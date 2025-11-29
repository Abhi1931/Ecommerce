package com.example.ecommerce.Repository;

import com.example.ecommerce.Entity.Cart;
import com.example.ecommerce.Entity.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<Cart,Long> {

    List<Cart> findByUserId(Long user_id);
    Optional<Cart> findByUserIdAndProductPid(Long user_id, Long product_id);

    void deleteByUserId(Long user_id);

    List<Cart> user(UserData user);

    boolean existsByUserIdAndProductPid(Long userId, Long productId);

    boolean existsByUserId(Long userId);

    boolean existsByProductPid(Long pid);
}
