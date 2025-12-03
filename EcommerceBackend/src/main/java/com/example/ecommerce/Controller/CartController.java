package com.example.ecommerce.Controller;


import com.example.ecommerce.DTO.CartDTO;
import com.example.ecommerce.Service.Implementations.CartService;
import com.example.ecommerce.Service.Implementations.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/essentials/user/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<CartDTO> addToCart(@PathVariable("productId") Long productId,
                                             @RequestParam(required = false, defaultValue = "1") int quantity,
                                             Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        CartDTO cartDTO = cartService.addToCart(userId, productId, quantity);
        return ResponseEntity.ok(cartDTO);
    }

    @GetMapping("")
    public ResponseEntity<List<CartDTO>> getUserCart(Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        return ResponseEntity.ok(cartService.getUserCart(userId));
    }

    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable("productId") Long productId,
                                               Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
