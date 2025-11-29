package com.example.ecommerce.DTO;

import com.example.ecommerce.Entity.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdersDTO {

    private Long id;
    private int quantity;
    private double totalPrice;

    private String Address;

    private LocalDateTime orderPlacedAt;
    private ProductDTO product;
    private UserDTO user;

    private Status status;


}
