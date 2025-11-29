package com.example.ecommerce.Mapper;

import com.example.ecommerce.DTO.WishlistDTO;
import com.example.ecommerce.Entity.Wishlist;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface WishlistMapper {
    WishlistDTO toDTO(Wishlist wishlist);
    Wishlist toEntity(WishlistDTO wishlistDTO);

    List<WishlistDTO> toDTOs(List<Wishlist> wishlists);
    List<Wishlist> toEntities(List<WishlistDTO> wishlistDTOs);
}
