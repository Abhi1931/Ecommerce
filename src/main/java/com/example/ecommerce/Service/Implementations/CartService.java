package com.example.ecommerce.Service.Implementations;


import com.example.ecommerce.DTO.CartDTO;
import com.example.ecommerce.Entity.Cart;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Entity.UserData;
import com.example.ecommerce.Exceptions.ResourceNotFoundException;
import com.example.ecommerce.Mapper.CartMapper;
import com.example.ecommerce.Repository.CartRepo;
import com.example.ecommerce.Repository.ProductRepo;
import com.example.ecommerce.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepo cartRepository;
    private final ProductRepo productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    public CartDTO addToCart(Long user_id, Long pid, int quantity) {

        Products product = productRepository.findById(pid)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", pid));

        UserData user = userRepository.findById(user_id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", user_id));

        Optional<Cart> products = cartRepository.findByUserIdAndProductPid(user_id, pid);

        Cart cart;
        if (products.isPresent()) {
            cart = products.get();
            int currentQuantity = cart.getQuantity() == 0 ? quantity : cart.getQuantity();
            cart.setQuantity(currentQuantity + quantity);
        } else{
            cart = new Cart();
            cart.setUser(user);
        cart.setProduct(product);
        cart.setQuantity(quantity);
        cart.setAddedAt(LocalDateTime.now());
    }
        return cartMapper.toDTO(cartRepository.save(cart));
    }

    public List<CartDTO> getUserCart(Long user_id) {

        return cartMapper.toDTOs(cartRepository.findByUserId(user_id));
    }

    public void removeFromCart(Long user_id, Long product_id) {
        boolean check = cartRepository.existsByUserIdAndProductPid(user_id,product_id);
        if (check)  {
            cartRepository.deleteById(product_id);
        }
        else{
            throw new ResourceNotFoundException("userId or productId", "id", product_id);
        }
    }

    @Transactional
    public void clearCart(Long user_id) {
         boolean check = cartRepository.existsByUserId(user_id);
         if (check) {
             cartRepository.deleteByUserId(user_id);
         }
         else {
             throw new ResourceNotFoundException("userId", "id", user_id);
         }
    }
}

