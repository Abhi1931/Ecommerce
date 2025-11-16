package com.example.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orders {

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

        private double totalPrice;

        private LocalDateTime orderPlacedAt;

        @Enumerated(EnumType.STRING)
        @Column(name = "status")
        private Status status;

        @PrePersist
        public void prePersist() {
            orderPlacedAt = LocalDateTime.now();
        }
    }

