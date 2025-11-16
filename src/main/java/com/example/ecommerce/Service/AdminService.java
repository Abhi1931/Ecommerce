package com.example.ecommerce.Service;

import com.example.ecommerce.DTO.AdminDTO;
import com.example.ecommerce.DTO.OrdersDTO;
import com.example.ecommerce.DTO.SellerDTO;
import com.example.ecommerce.Entity.Products;


import java.util.List;
import java.util.Optional;


public interface AdminService {

  Optional<AdminDTO> GetUserById(Long id);

  List<AdminDTO> GetAllUserData();

  AdminDTO CreateUser(AdminDTO adminDTO);

  String DeleteUserById(Long id);

  AdminDTO UpdateUserDetails(AdminDTO update, Long id);

 AdminDTO GetUserByName(String name);

  // for Product Methods

  List<Products> GetAllProducts();

  void AddProducts(Products prod);

//  Optional<Products> GetByCategories(String Categories);

  Products UpdateProdDetails(Products updates,Long id);

  String DeleteProdById(Long id);


    List<SellerDTO> AllSellers();

    List<OrdersDTO> GetAllOrders();
}
