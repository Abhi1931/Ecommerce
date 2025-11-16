package com.example.ecommerce.Service.Implementations;


import com.example.ecommerce.DTO.CartDTO;
import com.example.ecommerce.Entity.Cart;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Entity.UserData;
import com.example.ecommerce.Mapper.CartMapper;
import com.example.ecommerce.Repository.CartRepo;
import com.example.ecommerce.Repository.ProductRepo;
import com.example.ecommerce.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepo cartRepository;
    private final ProductRepo productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    public CartDTO addToCart(Long user_id, Long product_id, int quantity) {
        Products product = productRepository.findById(product_id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        UserData user = userRepository.findById(user_id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setProduct(product);
        cart.setQuantity(quantity);
        cart.setAddedAt(LocalDateTime.now());

        return cartMapper.toDTO(cartRepository.save(cart));
    }

    public List<CartDTO> getUserCart(Long user_id) {
        return cartMapper.toDTOs(cartRepository.findByUserId(user_id));
    }

    public void removeFromCart(Long user_id, Long product_id) {
        cartRepository.findByUserIdAndProductPid(user_id, product_id)
                .ifPresent(cartRepository::delete);
    }

    @Transactional
    public void clearCart(Long user_id) {

        cartRepository.deleteByUserId(user_id);
    }
}

