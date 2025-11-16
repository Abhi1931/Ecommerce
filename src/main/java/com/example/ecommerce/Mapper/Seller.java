package com.example.ecommerce.Mapper;

import com.example.ecommerce.DTO.SellerDTO;
import com.example.ecommerce.Entity.Sellerdata;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface Seller {

//    @Mapping(target = "products", ignore = true) // avoid mapping circular references
//    @Mapping(target = "role", ignore = true)
    SellerDTO toDTO(Sellerdata sellerdata);


//    @Mapping(target = "products", ignore = true)
//    @Mapping(target = "role", ignore = true)
    Sellerdata toEntity(SellerDTO sellerDTO);
}
