package com.example.ecommerce.Mapper;


import com.example.ecommerce.DTO.CartDTO;
import com.example.ecommerce.Entity.Cart;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface CartMapper {
    CartDTO toDTO(Cart cart);
    Cart toEntity(CartDTO cartDTO);

    List<CartDTO> toDTOs(List<Cart> carts);
    List<Cart> toEntities(List<CartDTO> cartDTOs);
}
