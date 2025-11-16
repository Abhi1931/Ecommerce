package com.example.ecommerce.Service.Implementations;

import com.example.ecommerce.DTO.ProductDTO;
import com.example.ecommerce.DTO.SellerDTO;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Entity.Sellerdata;
import com.example.ecommerce.Mapper.ProductMapper;
import com.example.ecommerce.Mapper.Seller;
import com.example.ecommerce.Repository.ProductRepo;
import com.example.ecommerce.Repository.SellerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import java.net.http.HttpResponse;
import java.util.List;
import java.util.Optional;

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

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ResponseEntity<SellerDTO> getSellerById(Long id){
       Sellerdata sell=  sellerRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.OK));
       SellerDTO sellerDTO = seller.toDTO(sell);
       return ResponseEntity.ok(sellerDTO);
    }

    public ResponseEntity<SellerDTO> updateDetails(Long id, SellerDTO sellerDTO) {
        Sellerdata sell = sellerRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        sell.setEmail(sellerDTO.getEmail());
        sell.setAge(sellerDTO.getAge());
        sell.setGender(sellerDTO.getGender());
        sell.setCompany(sellerDTO.getCompany());
        sell.setNumber(sellerDTO.getNumber());
        sell.setName(sellerDTO.getName());
        sell.setPassword(passwordEncoder.encode(sellerDTO.getPassword()));

        sell.setUsername(sellerDTO.getUsername());
        sell.setSid(sellerDTO.getSid());
        sellerRepo.save(sell);
         SellerDTO sels=  sellerRepo.findById(id).map(seller::toDTO).orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT));
         return new ResponseEntity<>(sels,HttpStatus.OK);

    }

    public ResponseEntity<String> DeleteProdById(Long sid,Long pid) {
        Products products=    productRepo.findBySellers_SidAndPid(sid,pid).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND));

           productRepo.deleteById(products.getPid());
          Optional<Products> productsOptional = productRepo.findBySellers_SidAndPid(sid, pid);
        if (products == null){
            return ResponseEntity.ok("delted");
        }
        else
            return ResponseEntity.ok("not");
    }

        public List<ProductDTO> getProducts(Long sd) {
           List<Products> pro=   productRepo.findBySellers_Sid(sd);
              return productMapper.toDTOs(pro);
    }
}
