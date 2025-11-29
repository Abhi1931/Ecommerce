package com.example.ecommerce.Service.Implementations;


import com.example.ecommerce.DTO.WishlistDTO;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Entity.UserData;
import com.example.ecommerce.Entity.Wishlist;
import com.example.ecommerce.Mapper.WishlistMapper;
import com.example.ecommerce.Repository.ProductRepo;
import com.example.ecommerce.Repository.UserRepository;
import com.example.ecommerce.Repository.WishlistRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepo wishlistRepository;
    private final ProductRepo productRepository;
    private final UserRepository userRepository;
    private final WishlistMapper wishlistMapper;

    public boolean addToWishlist(Long user_id, Long product_id) {

        if (wishlistRepository.existsByUserIdAndProductPid(user_id,product_id)) {
            return false;
        }

        Products product = productRepository.findById(product_id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        UserData user = userRepository.findById(user_id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        wishlist.setAddedAt(LocalDateTime.now());
        wishlistRepository.save(wishlist);
        return true;
    }

    public List<WishlistDTO> getUserWishlist(Long user_id) {
        return wishlistMapper.toDTOs(wishlistRepository.findByUserId(user_id));
    }

    public void removeFromWishlist(Long user_id, Long product_id) {
        wishlistRepository.findByUserIdAndProductPid(user_id, product_id)
                .ifPresent(wishlistRepository::delete);
    }

    @Transactional
    public void clearWishlist(Long user_id) {
        wishlistRepository.deleteAllByUserId(user_id);
    }
}
