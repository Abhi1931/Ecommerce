package com.example.ecommerce.Controller;


import com.example.ecommerce.DTO.OrdersDTO;
import com.example.ecommerce.Service.Implementations.UserPrincipal;
import com.example.ecommerce.Service.Implementations.OrdersService;
import lombok.RequiredArgsConstructor;
import org.hibernate.query.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/essentials/user/orders")
@RequiredArgsConstructor
public class OrdersController {

    private final OrdersService ordersService;

    @PostMapping("/buyall")
    public ResponseEntity<List<OrdersDTO>> buyAllCartItems(Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        List<OrdersDTO> orders = ordersService.buyAllFromCart(userId);
        return ResponseEntity.ok(orders);
    }


    @PostMapping("/place/{productId}")
    public ResponseEntity<OrdersDTO> placeOrder(@PathVariable Long productId,
                                                @RequestParam(required = false, defaultValue = "1") int quantity,
                                                Authentication authentication,@RequestBody String address) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        OrdersDTO order = ordersService.placeOrder(userId, productId, quantity,address);
        return order!= null? ResponseEntity.ok(order) : ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrdersDTO>> getUserOrders(Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getUserData().getId();
        return ResponseEntity.ok(ordersService.getUserOrders(userId));
    }

}
