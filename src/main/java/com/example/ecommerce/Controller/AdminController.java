package com.example.ecommerce.Controller;

import com.example.ecommerce.DTO.*;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Service.Implementations.AdminServiceImpl;
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


    @GetMapping("/user/{id}")
    public ResponseEntity<Optional<AdminDTO>> GetUserById(@PathVariable("id") Long id){
        Optional<AdminDTO> user = adminService.GetUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/user/search/{name}")
    public ResponseEntity<AdminDTO> SearchUserByname(String name){
        AdminDTO use = adminService.GetUserByName(name);
        return new ResponseEntity<>(use,HttpStatus.OK);



    }


    @PutMapping("/user/{id}")
    public AdminDTO UpdateUserById(@RequestBody AdminDTO update, @PathVariable("id") Long id){

        return adminService.UpdateUserDetails(update,id);
    }
//

    @PostMapping("/adduser")
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
    public String DeleteById(@PathVariable("id") Long id){
         return adminService.DeleteUserById(id);
    }

    // -- For Products

    @PostMapping("/addprods")
    public void AddProducts(@RequestBody Products prod){
        adminService.AddProducts(prod);
    }


    @PutMapping("/products/{pid}")
    public Products UpdateProdDetails(@RequestBody Products updates,@PathVariable("pid") Long id){
        return adminService.UpdateProdDetails(updates,id);
    }

    @DeleteMapping("/products/{pid}")
    public String DeleteProductById(@PathVariable("pid") Long id){
        return adminService.DeleteProdById(id);
    }



     @GetMapping("/allorders")
    public ResponseEntity<List<OrdersDTO>> AllOrders(){
       List<OrdersDTO> orders =  adminService.GetAllOrders();
        return new ResponseEntity<>(orders,HttpStatus.OK);
     }

}

