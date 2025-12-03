package com.example.ecommerce.Controller;

import com.example.ecommerce.DTO.ProductDTO;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Service.AdminService;
import com.example.ecommerce.Service.Implementations.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/essentials/products")
public class ProductController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ProductService productService;

    @GetMapping("/allproducts")
    public List<Products> getAllProducts() {

        return adminService.GetAllProducts();
    }


    @GetMapping("/category/{category}")
    public List<ProductDTO> getByCategory(@PathVariable String category) {
        return productService.getByCategories(category);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Optional<ProductDTO>> getByProductId(@PathVariable("id") Long id) {
        Optional<ProductDTO> prod = productService.getProdById(id);
        return ResponseEntity.ok(prod);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> search(@RequestParam("kword") String kword){
              List<ProductDTO> lp=   productService.searchprod(kword);
              return new ResponseEntity<>(lp,HttpStatus.OK);
    }

   @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    @PutMapping("/{pid}")
    public Products UpdateProdDetails(@RequestBody Products updates,@PathVariable("pid") Long id){
        return adminService.UpdateProdDetails(updates,id);
    }

}
