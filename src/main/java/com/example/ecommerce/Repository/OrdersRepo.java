package com.example.ecommerce.Repository;

import com.example.ecommerce.Entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepo extends JpaRepository<Orders,Long> {
    List<Orders> findByUserId(Long user_id);
    List<Orders> findByUserIdOrderByOrderPlacedAtDesc(Long user_id);

    List<Orders> findAllByProduct_PidIn(List<Long> productPid);

    boolean existsByProduct_Pid(Long productPid);
}
