package com.example.ecommerce.Repository;

import com.example.ecommerce.Entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepo extends JpaRepository<Wishlist,Long> {

    List<Wishlist> findByUserId(Long user_id);
    Optional<Wishlist> findByUserIdAndProductPid(Long user_id, Long product_id);
    void deleteByUserId(Long user_id);
}
