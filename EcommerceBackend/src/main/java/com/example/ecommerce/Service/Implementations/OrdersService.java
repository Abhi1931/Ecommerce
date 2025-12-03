package com.example.ecommerce.Service.Implementations;


import com.example.ecommerce.DTO.OrdersDTO;
import com.example.ecommerce.Entity.*;
import com.example.ecommerce.Mapper.OrdersMapper;
import com.example.ecommerce.Repository.CartRepo;
import com.example.ecommerce.Repository.OrdersRepo;
import com.example.ecommerce.Repository.ProductRepo;
import com.example.ecommerce.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private final OrdersRepo ordersRepository;
    private final ProductRepo productRepository;
    private final UserRepository userRepository;
    private final OrdersMapper ordersMapper;
    private final CartRepo cartRepo;


    public List<OrdersDTO> buyAllFromCart(Long userId) {
        List<Cart> cartItems = cartRepo.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        List<Orders> orders = new ArrayList<>();

        for (Cart cart : cartItems) {
            Products product = cart.getProduct();
            int quantity = cart.getQuantity();
            double totalPrice = product.getPrice() * quantity;

            Orders order = new Orders();
            order.setUser(cart.getUser());
            order.setProduct(product);
            order.setQuantity(quantity);
            order.setTotalPrice(totalPrice);
            order.setOrderPlacedAt(LocalDateTime.now());

            orders.add(order);
        }


        List<Orders> savedOrders = ordersRepository.saveAll(orders);

        cartRepo.deleteAll(cartItems);

        return ordersMapper.toDTOs(savedOrders);
    }


    public OrdersDTO placeOrder(Long user_id, Long product_id, int quantity,String address) {
        Products product = productRepository.findById(product_id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        UserData user = userRepository.findById(user_id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double totalPrice = product.getPrice() * quantity;
        System.out.println("address = " + address);
        Orders order = new Orders();
        order.setStatus(Status.PLACED);
        order.setUser(user);
        order.setAddress(address.toLowerCase());
        order.setProduct(product);
        order.setQuantity(quantity);
        order.setTotalPrice(totalPrice);
        order.setOrderPlacedAt(LocalDateTime.now());

        return ordersMapper.toDTO(ordersRepository.save(order));
    }

    public List<OrdersDTO> getUserOrders(Long user_id) {
        return ordersMapper.toDTOs(ordersRepository.findByUserIdOrderByOrderPlacedAtDesc(user_id));
    }

}
