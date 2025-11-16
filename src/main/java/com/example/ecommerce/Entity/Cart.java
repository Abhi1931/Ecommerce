package com.example.ecommerce.Entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


    @Entity
    @Table(name = "cart")
   @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class Cart {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private UserData user;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "product_id", nullable = false)
        private Products product;

        private int quantity;

        private LocalDateTime addedAt;

        @PrePersist
        public void prePersist() {
            addedAt = LocalDateTime.now();
        }
    }

