package com.example.ecommerce.Mapper;

import com.example.ecommerce.DTO.AdminDTO;
import com.example.ecommerce.Entity.UserData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "role", target = "role.roleName")
    UserData toEntity(AdminDTO adminDTO);

    @Mapping(source = "role.roleName", target = "role")
    AdminDTO toDTO(UserData  userData);

}


