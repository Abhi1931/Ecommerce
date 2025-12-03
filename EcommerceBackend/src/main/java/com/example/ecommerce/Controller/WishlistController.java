package com.example.ecommerce.Controller;


import com.example.ecommerce.DTO.WishlistDTO;
import com.example.ecommerce.Service.Implementations.UserPrincipal;
import com.example.ecommerce.Service.Implementations.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/essentials/user/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<Boolean> addToWishlist(@PathVariable Long productId,
                                                     Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        boolean added = wishlistService.addToWishlist(userId, productId);
        return ResponseEntity.ok(added);
    }

    @GetMapping
    public ResponseEntity<List<WishlistDTO>> getUserWishlist(Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        return ResponseEntity.ok(wishlistService.getUserWishlist(userId));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId,
                                                   Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearWishlist(Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        wishlistService.clearWishlist(userId);
        return ResponseEntity.noContent().build();
    }
}
