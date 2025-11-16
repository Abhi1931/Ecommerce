package com.example.ecommerce.Service.Implementations;

import com.example.ecommerce.DTO.*;
import com.example.ecommerce.Entity.*;
import com.example.ecommerce.Mapper.OrdersMapper;
import com.example.ecommerce.Mapper.ProductMapper;
import com.example.ecommerce.Mapper.Seller;
import com.example.ecommerce.Mapper.UserMapper;
import com.example.ecommerce.Repository.*;
import com.example.ecommerce.Service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
//import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@Service
public class AdminServiceImpl implements AdminService {

    private final RoleRepo repo;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final UserRepository userRepository;

    private final ProductRepo productRepo;
    private final UserMapper userMapper;
    private final SellerRepo sellerRepo;
    private  final ProductMapper productMapper;

    @Autowired
    private OrdersMapper ordersMapper;
    private final OrdersRepo ordersRepo;

     private final Seller sellerMapper;
    public AdminServiceImpl(RoleRepo repo,ProductMapper productMapper, UserRepository userRepository, ProductRepo productRepo, UserMapper userMapper,SellerRepo sellerRepo,Seller sellerMapper,OrdersRepo ordersRepo) {
        this.repo = repo;
        this.userRepository = userRepository;
        this.productRepo = productRepo;
        this.userMapper = userMapper;
        this.sellerRepo=sellerRepo;
        this.ordersRepo=ordersRepo;
        this.sellerMapper=sellerMapper;
        this.productMapper= productMapper;

    }


    //For User Data
    @Override
    public Optional<AdminDTO> GetUserById(Long id) {

        return userRepository.findById(id).map(userMapper::toDTO);
    }

    @Override
     public List<AdminDTO> GetAllUserData() {

//        List<AdminDTO> userDTOList = new ArrayList<>();
//         List<UserData> list= new ArrayList<>(userRepository.findAll());
//          list.forEach(userData->{
//              AdminDTO userDTO = new AdminDTO();
//              userDTO.setUsername(userData.getUsername());
//              userDTO.setEmail(userData.getEmail());
//              userDTO.setFullname(userData.getFullname());
//              userDTO.setPassword(userData.getPassword());
//              userDTO.setId(userData.getId());
//              userDTO.setRole(userData.getRole().getRoleName());
//              userDTOList.add(userDTO);
//          });
        return userRepository.findAll().stream().map(userMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public AdminDTO CreateUser(AdminDTO adminDTO) {

        UserData user = userMapper.toEntity(adminDTO);
        Role role = repo.findByRoleName(adminDTO.getRole()).orElseThrow(() -> new RuntimeException("user not found"));
        user.setRole(role);

        userRepository.save(user);
        if (user == null) {
            System.out.println("User details not saved");
        }
        else{
            System.out.println("User details are saved");
        }
        return userMapper.toDTO(user);

    }

    @Override
    public String DeleteUserById(Long id) {
        userRepository.deleteById(id);
        return "User deleted Successfully";
    }

    @Override
    public AdminDTO UpdateUserDetails(AdminDTO update, Long id) {
        if (userRepository.findById(id).isPresent()) {
            UserData user = userMapper.toEntity(update);
            user.setId(id);
            user.setPassword(passwordEncoder.encode(update.getPassword()));
            Role role = repo.findByRoleName(update.getRole()).orElseThrow(() -> new RuntimeException("role not found"));
            user.setRole(role);
            userRepository.save(user);
            return userMapper.toDTO(user);
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

//        return userRepository.findById(id).map(user ->  {
//            user.setFullname(update.getFullname());
//            user.setEmail(update.getEmail());
//            user.setPassword(update.getPassword());
//            user.setUsername(update.getUsername());
//            user.setId(update.getId());
//            return userRepository.save(user);
//        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    }

    @Override
    public AdminDTO GetUserByName(String name) {
        UserData user = userRepository.findByFullname(name).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
      return   userMapper.toDTO(user);
    }

    // -- For  Product

    @Override
    public List<Products> GetAllProducts() {
        return productRepo.findAll();
    }


    public List<Products> GetAllAdminProducts() {
            List<Sellerdata> sellers = sellerRepo.findAll();
                List<Products> products = productRepo.findAll();
                 List<Long> sellerpids = new ArrayList<>();
        List<Long> pids = new ArrayList<>(products.stream().map(Products::getPid).toList());
               List<Long> sids =  sellers.stream().map(Sellerdata::getSid).toList();
               for (Long d : sids){
                  Sellerdata sellerdata = sellerRepo.findById(d).orElseThrow(() -> new RuntimeException("bokka"));
                     sellerpids.addAll(sellerdata.getProducts().stream().map(Products::getPid).toList());
               }

               List<Products> adminprods = new ArrayList<>();
               for (Long u : pids) {
                   if (!(sellerpids.contains(u))) {
                       adminprods.add(productRepo.findById(u).orElseThrow(() -> new RuntimeException("bokka")));
                   }
               }
        return adminprods;
    }

    public List<ProductDTO> GetAllSellerProducts(){
            List<Long> sids = sellerRepo.findAll().stream().map(Sellerdata::getSid).toList();
        List<Products> ert = new ArrayList<>();
            for (Long s: sids) {
                 ert.addAll(productRepo.findBySellers_Sid(s));
            }

            return productMapper.toDTOs(ert);
    }

    @Override
    public void AddProducts(Products prod) {
        productRepo.save(prod);
    }

//    @Override
//    public Optional<Products> GetByCategories(String Category) {
//        return productRepo.findByCategory(Category);
//    }

    @Override
    public Products UpdateProdDetails(Products prod, Long id) {
        return productRepo.findById(id)
                .map( updates -> {
            updates.setPrice(prod.getPrice());
            updates.setPid(prod.getPid());
            updates.setCategory(prod.getCategory());
            updates.setName(prod.getName());
            updates.setBrand(prod.getBrand());
            updates.setDescription(prod.getDescription());
            updates.setAvailability(prod.isAvailability());
            updates.setQuantity(prod.getQuantity());
            return productRepo.save(updates);
        })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with ID: " + id));
    }

    @Override
    public String DeleteProdById(Long id) {
        productRepo.deleteById(id);
        return "Product Deleted Successfully";
    }

    @Override
    public List<SellerDTO> AllSellers() {
        List<Sellerdata> sellerss= sellerRepo.findAll();
        List<SellerDTO> daata =sellerss.stream().map(sellerMapper::toDTO).collect(Collectors.toList());
        return daata;
    }

    @Override
    public List<OrdersDTO> GetAllOrders() {
       List<Orders> data = ordersRepo.findAll();
         List<OrdersDTO> data2=  ordersMapper.toDTOs(data);
         return data2;
    }


}
