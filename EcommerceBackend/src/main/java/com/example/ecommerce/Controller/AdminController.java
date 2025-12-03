package com.example.ecommerce.Controller;

import com.example.ecommerce.DTO.*;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Mapper.Seller;
import com.example.ecommerce.Service.Implementations.AdminServiceImpl;
import com.example.ecommerce.Service.Implementations.SellerService;
import com.example.ecommerce.Service.Implementations.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/essentials/admin")
public class AdminController {

    @Autowired
    private AdminServiceImpl adminService;

    @Autowired
    private SellerService sellerservice;

    @GetMapping("/userprofile/{id}")
    public ResponseEntity<Optional<AdminDTO>> GetUserById(@PathVariable("id") Long id,Authentication authentication){
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Long adminId = principal.getUserData().getId();
        Optional<AdminDTO> user = adminService.GetUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/user/search/{name}")
    public ResponseEntity<AdminDTO> SearchUserByname(String name,Authentication authentication){
        AdminDTO use = adminService.GetUserByName(name);
        return new ResponseEntity<>(use,HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/userprofile/{id}")
    public AdminDTO UpdateUserById(@RequestBody AdminDTO update, @PathVariable("id") Long userid){
        return adminService.UpdateUserDetails(update,userid);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/seller/{id}")
    public ResponseEntity<SellerDTO> updateSellerDetailsById(@PathVariable("id") Long id,@RequestBody SellerDTO sellerDTO) {
        return  sellerservice.updateDetails(id, sellerDTO);
    }


    @PostMapping("/seller/adduser")
    public void CreateSeller( @RequestBody SellerDTO sellerDTO){
        adminService.CreateSeller(sellerDTO);
    }

    @PostMapping("/userprofile/adduser")
    public void CreateUser( @RequestBody AdminDTO adminDTO){
        adminService.CreateUser(adminDTO);
    }

    @GetMapping("/alldata")
    public List<AdminDTO> GetAllUsers(){
        return adminService.GetAllUserData() ;
    }


    @GetMapping("/allsellers")
    public List<SellerDTO> GetAllSellers(Authentication authentication){
        return adminService.AllSellers();
    }

    @GetMapping("/products")
    public List<Products> getAllAdminProducts(){
        return adminService.GetAllAdminProducts();
    }

    @GetMapping("/sproducts")
    public ResponseEntity<List<ProductDTO>> CountAllSellersProducts(){
        return new ResponseEntity<>(adminService.GetAllSellerProducts(),HttpStatus.OK);
    }

    @DeleteMapping("/user/{id}")
    public void DeleteById(@PathVariable("id") Long id){
          adminService.DeleteUserById(id);
    }

    // -- For Products

    @PostMapping("/addprods")
    public void AddProducts(@RequestBody Products prod){
        adminService.AddProducts(prod);
    }


    @DeleteMapping("/products/{pid}")
    public void DeleteProductById(@PathVariable("pid") Long id){
         adminService.DeleteProdById(id);
    }



     @GetMapping("/allorders")
    public ResponseEntity<List<OrdersDTO>> AllOrders(){
       List<OrdersDTO> orders =  adminService.GetAllOrders();
        return new ResponseEntity<>(orders,HttpStatus.OK);
     }

}

