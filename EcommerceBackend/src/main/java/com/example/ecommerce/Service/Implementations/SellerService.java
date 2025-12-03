package com.example.ecommerce.Service.Implementations;

import com.example.ecommerce.DTO.OrdersDTO;
import com.example.ecommerce.DTO.ProductDTO;
import com.example.ecommerce.DTO.SellerDTO;
import com.example.ecommerce.Entity.Orders;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Entity.Sellerdata;
import com.example.ecommerce.Entity.UserData;
import com.example.ecommerce.Exceptions.DeleteBlockReason;
import com.example.ecommerce.Exceptions.DeleteNotAllowedEx;
import com.example.ecommerce.Mapper.OrdersMapper;
import com.example.ecommerce.Mapper.ProductMapper;
import com.example.ecommerce.Mapper.Seller;
import com.example.ecommerce.Mapper.WishlistMapper;
import com.example.ecommerce.Repository.*;
import org.hibernate.query.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import java.net.http.HttpResponse;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SellerService {

    @Autowired
    private SellerRepo sellerRepo;

    @Autowired
    private Seller seller;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private OrdersRepo ordersRepository;

    @Autowired
    private OrdersMapper ordersMapper;

    @Autowired
    private WishlistRepo  wishlistRepository;

    @Autowired
    private CartRepo cartRepository;



    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public ResponseEntity<SellerDTO> getSellerById(Long id){
       Sellerdata sell=  sellerRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.OK));
       SellerDTO sellerDTO = seller.toDTO(sell);
       return ResponseEntity.ok(sellerDTO);
    }

    public ResponseEntity<SellerDTO> updateDetails(Long id, SellerDTO sellerDTO) {
        Sellerdata sellerdata = sellerRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        boolean check  = sellerRepo.existsByEmail(sellerDTO.getEmail());
        boolean sellerWithSameUsername = sellerRepo.existsByUsername(sellerDTO.getUsername());

        if (sellerDTO.getPassword() != null && !sellerDTO.getPassword().isBlank()) {
            sellerdata.setPassword(passwordEncoder.encode(sellerDTO.getPassword()));
        }

        if (sellerWithSameUsername && (!sellerDTO.getUsername().equalsIgnoreCase(sellerdata.getUsername()))) throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");

        if (check && (!sellerDTO.getEmail().equalsIgnoreCase(sellerdata.getEmail()))) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        sellerdata.setUsername(sellerDTO.getUsername());
        sellerdata.setEmail(sellerDTO.getEmail());
        sellerdata.setAge(sellerDTO.getAge());
        sellerdata.setGender(sellerDTO.getGender());
        sellerdata.setCompany(sellerDTO.getCompany());
        sellerdata.setNumber(sellerDTO.getNumber());
        sellerdata.setName(sellerDTO.getName());
        sellerRepo.save(sellerdata);
         SellerDTO sels=  sellerRepo.findById(id).map(seller::toDTO).orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT));
         return new ResponseEntity<>(sels,HttpStatus.OK);
    }

     @Transactional
    public boolean DeleteProdById(Long sid,Long pid) {
        Products product=  productRepo.findBySellers_SidAndPid(sid,pid).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (product.getSellers() != null && !product.getSellers().isEmpty()) {
            product.getSellers().forEach(seller -> seller.getProducts().remove(product));
            product.getSellers().clear();
        }

         boolean isOrdered = ordersRepository.existsByProduct_Pid(pid);
         if (isOrdered) {
             throw new DeleteNotAllowedEx(DeleteBlockReason.ORDERED,
                     "Product cannot be deleted because it has been ordered");
         }


         boolean inCart = cartRepository.existsByProductPid(pid);
         if (inCart) {
             throw new DeleteNotAllowedEx(DeleteBlockReason.IN_CART,
                     "Product cannot be deleted because it exists in a cart");
         }

         boolean inWishlist = wishlistRepository.existsByProductPid(pid);
         if (inWishlist) {
             throw new DeleteNotAllowedEx(DeleteBlockReason.IN_WISHLIST,
                     "Product cannot be deleted because it exists in a wishlist");
         }
           productRepo.delete(product);
          boolean still = productRepo.findBySellers_SidAndPid(sid, pid).isPresent();
            return still;
    }

        public List<ProductDTO> getProducts(Long sd) {
           List<Products> pro=   productRepo.findBySellers_Sid(sd);
              return productMapper.toDTOs(pro);
    }

    public List<OrdersDTO> getProductStats(Long sd) {
        List<Products> pro=   productRepo.findBySellers_Sid(sd);
        List<Long> productIds = pro.stream()
                .map(Products::getPid)
                .collect(Collectors.toList());
        List<Orders> orders= ordersRepository.findAllByProduct_PidIn(productIds);
        return ordersMapper.toDTOs(orders);
    }
}
