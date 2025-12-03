package com.example.ecommerce.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.apache.logging.log4j.util.ProcessIdUtil;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(exclude = "sellers")
@ToString(exclude = "sellers")
public class Products {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pid;

    @Column
    private String category;

    @Column
   private String name;

   @Column
   private double price;

   @Column
   private String imageUrl;

   @Column
   private String description;

   @Column
   private String brand;

   @Column
   private boolean availability;

   @Column
   private int quantity;

    @ManyToMany(mappedBy = "products")
    @JsonIgnore
    private Set<Sellerdata> sellers;


    public Products(boolean availability,String brand,String category,String description,String name,double price,int quantity,String imageUrl) {
        this.availability = availability;
        this.brand = brand;
        this.category = category;
        this.description = description;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

}
