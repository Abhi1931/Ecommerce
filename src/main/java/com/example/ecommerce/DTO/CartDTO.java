package com.example.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
private Long id;

    private int quantity;

    private LocalDateTime addedAt;
    private ProductDTO product;
}
