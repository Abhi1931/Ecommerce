package com.example.ecommerce.Mapper;

import com.example.ecommerce.DTO.ProductDTO;
import com.example.ecommerce.DTO.SellerSummaryDTO;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Entity.Sellerdata;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "sellers", ignore = true)
    Products toEntity(ProductDTO productDTO);


    @Mapping(target = "sellers", source = "sellers", qualifiedByName = "mapToSellerSummary")
    ProductDTO toDTO(Products products);

    List<ProductDTO> toDTOs(List<Products> products);


    @Named("mapToSellerSummary")
    default List<SellerSummaryDTO> mapToSellerSummary(Set<Sellerdata> sellers) {
        if (sellers == null) return List.of();
        return sellers.stream()
                .map(s -> new SellerSummaryDTO(s.getSid(), s.getName(), s.getCompany()))
                .collect(Collectors.toList());
    }
}
