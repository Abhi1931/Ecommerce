package com.example.ecommerce.DTO;

import com.example.ecommerce.Entity.Sellerdata;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductDTO {

    private Long pid;

    private String name;

    private String description;

    private float price;

    private String category;

    private String brand;

    private int quantity;

    private boolean availability;

    private String imageUrl;

    private List<SellerSummaryDTO> sellers;


}
