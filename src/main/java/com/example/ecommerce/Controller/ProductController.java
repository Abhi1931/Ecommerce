package com.example.ecommerce.Controller;

import com.example.ecommerce.DTO.ProductDTO;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Service.AdminService;
import com.example.ecommerce.Service.Implementations.LRserviceImpl;
import com.example.ecommerce.Service.Implementations.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // ✅ Get all products
    @GetMapping("/allproducts")
    public List<Products> getAllProducts() {

        return adminService.GetAllProducts();
    }

   //  ✅ Get products by category
    @GetMapping("/category/{category}")
    public List<ProductDTO> getByCategory(@PathVariable("category") String category) {
        return productService.getByCategories(category); // Make sure this returns List<Products>
    }

    // ✅ Get product by ID
    @GetMapping("/p/{id}")
    public ResponseEntity<Optional<ProductDTO>> getByProductId(@PathVariable("id") Long id) {
        Optional<ProductDTO> prod = productService.getProdById(id);
        return ResponseEntity.ok(prod);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> search(@RequestParam(required = false) String kword){
              List<ProductDTO> lp=   productService.searchprod(kword);
              return new ResponseEntity<>(lp,HttpStatus.OK);
    }




}
