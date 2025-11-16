package com.example.ecommerce.Controller;

import com.example.ecommerce.DTO.ProductDTO;
import com.example.ecommerce.DTO.SellerDTO;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Entity.Sellerdata;
import com.example.ecommerce.Service.Implementations.ProductService;
import com.example.ecommerce.Service.Implementations.SellerService;
import com.example.ecommerce.Service.Implementations.UserPrincipal;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/essentials/seller")
public class SellerController {

    @Autowired
    private ProductService productService;

    @Autowired
    private SellerService service;

    @GetMapping("/{id}")
    public ResponseEntity<SellerDTO> getSellerById(@PathVariable("id") Long sid) {
        return service.getSellerById(sid);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SellerDTO> updateSellerDetailsById(@PathVariable("id") Long id,@RequestBody SellerDTO sellerDTO) {
             return  service.updateDetails(id, sellerDTO);

    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getsellerprods(Authentication authentication){
        Long sd = ((UserPrincipal) authentication.getPrincipal()).getSeller().getSid();
        List<ProductDTO> sellerproducts = service.getProducts(sd);
        return new ResponseEntity<>(sellerproducts,HttpStatus.OK);
    }

    @DeleteMapping("/{sid}/product/{pid}")
    public ResponseEntity<String> DeleteProductById(@PathVariable("sid") Long sid,@PathVariable("pid") Long pid){
        return service.DeleteProdById(sid,pid);
    }

    @PreAuthorize("hasRole('SELLER','ADMIN')")
    @PostMapping("/addprods")
    public ResponseEntity<String> AddProducts(@RequestBody ProductDTO prod, Authentication authentication){
        Long sellerid= ((UserPrincipal) authentication.getPrincipal()).getSeller().getSid();
      String data=  productService.AddProducts(sellerid,prod);
        return new ResponseEntity<>(data,HttpStatus.OK);
    }

@PreAuthorize("hasRole('SELLER')")
    @PutMapping("/{sid}/products/{pid}")
    public ResponseEntity<Optional<ProductDTO>> UpdateProdDetailsById(
        @RequestBody ProductDTO updates,
        @PathVariable("sid") Long sid,
        @PathVariable("pid") Long pid){
         Optional<ProductDTO> op = productService.UpdateProdDetails(updates,sid,pid);
          return new ResponseEntity<>(op,HttpStatus.OK);
    }

}
