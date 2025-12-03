package com.example.ecommerce.Mapper;

import com.example.ecommerce.DTO.OrdersDTO;
import com.example.ecommerce.Entity.Orders;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface OrdersMapper {
    OrdersDTO toDTO(Orders orders);
    Orders toEntity(OrdersDTO ordersDTO);

    List<OrdersDTO> toDTOs(List<Orders> ordersList);
    List<Orders> toEntity(List<OrdersDTO> ordersDTOs);
}

