package com.example.ecommerce.Service.Implementations;

import com.example.ecommerce.DTO.*;
import com.example.ecommerce.Entity.*;
import com.example.ecommerce.Exceptions.DeleteBlockReason;
import com.example.ecommerce.Exceptions.DeleteNotAllowedEx;
import com.example.ecommerce.Exceptions.ResourceNotFoundException;
import com.example.ecommerce.Mapper.OrdersMapper;
import com.example.ecommerce.Mapper.ProductMapper;
import com.example.ecommerce.Mapper.Seller;
import com.example.ecommerce.Mapper.UserMapper;
import com.example.ecommerce.Repository.*;
import com.example.ecommerce.Service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@Service
public class AdminServiceImpl implements AdminService {

    private final RoleRepo repo;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final UserRepository userRepository;
    private final OrdersMapper ordersMapper;
    private final ProductRepo productRepo;
    private final UserMapper userMapper;
    private final SellerRepo sellerRepo;
    private final OrdersRepo ordersRepo;
    private final CartRepo cartRepo;
    private final WishlistRepo wishlistRepo;
    private  final ProductMapper productMapper;

     private final Seller sellerMapper;

    public AdminServiceImpl(RoleRepo repo,WishlistRepo wishlistRepo,CartRepo cartRepo,ProductMapper productMapper, UserRepository userRepository, ProductRepo productRepo, UserMapper userMapper,SellerRepo sellerRepo,Seller sellerMapper,OrdersRepo ordersRepo,OrdersMapper ordersMapper) {
        this.repo = repo;
        this.wishlistRepo = wishlistRepo;
        this.cartRepo = cartRepo;
        this.userRepository = userRepository;
        this.productRepo = productRepo;
        this.userMapper = userMapper;
        this.sellerRepo=sellerRepo;
        this.ordersRepo=ordersRepo;
        this.sellerMapper=sellerMapper;
        this.ordersMapper=ordersMapper;
        this.productMapper= productMapper;
    }


    //For User Data
    @Override
    public Optional<AdminDTO> GetUserById(Long id) {
        return userRepository.findById(id).map(userMapper::toDTO);
    }

    @Override
     public List<AdminDTO> GetAllUserData() {

        return userRepository.findAll().stream().map(userMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public AdminDTO CreateUser(AdminDTO adminDTO) {

        UserData user = userMapper.toEntity(adminDTO);
        Role role = repo.findByRoleName(adminDTO.getRole()).orElseThrow(() -> new ResourceNotFoundException("Role","name",adminDTO.getRole()));
        user.setRole(role);

        userRepository.save(user);
        UserData saved = userRepository.save(user);
        if (saved == null) {
            throw new RuntimeException("failed to save user");
        }
        return userMapper.toDTO(user);

    }

    @Override
    public SellerDTO CreateSeller(SellerDTO sellerDTO) {
        Sellerdata sellerdata = sellerMapper.toEntity(sellerDTO);
        sellerdata.setPassword(passwordEncoder.encode(sellerDTO.getPassword()));
        sellerRepo.save(sellerdata);
        Sellerdata saved = sellerRepo.save(sellerdata);
        if (saved == null) {
            throw new RuntimeException("Failed to save seller");
        }
        return sellerMapper.toDTO(sellerdata);
    }

    @Override
    public void DeleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public AdminDTO UpdateUserDetails(AdminDTO update, Long id) {

        UserData existing = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        UserData userWithSameUsername = userRepository.findByUsername(update.getUsername());
        if (userWithSameUsername != null && !userWithSameUsername.getId().equals(existing.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        existing.setFullname(update.getFullname());
        existing.setEmail(update.getEmail());
        existing.setUsername(update.getUsername());

        if (update.getPassword() != null && !update.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(update.getPassword()));
        }
        System.out.println("role = " + update.getRole());
        Role role = repo.findByRoleName(update.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role","name",update.getRole()));
        existing.setRole(role);

        userRepository.save(existing);
        return userMapper.toDTO(existing);
    }


    private boolean isDefaultAdmin(Long userId) {
      return userRepository.findById(userId).stream().anyMatch(user -> user.getEmail().equalsIgnoreCase("abhi@gmail.com"));
    }

    @Override
    public AdminDTO GetUserByName(String name) {
        UserData user = userRepository.findByFullname(name).orElseThrow(() -> new ResourceNotFoundException("User", "fullname", name));
      return userMapper.toDTO(user);
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
               for (Long id : sids){
                  Sellerdata sellerdata = sellerRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Seller", "id", id));
                     sellerpids.addAll(sellerdata.getProducts().stream().map(Products::getPid).toList());
               }

               List<Products> adminprods = new ArrayList<>();
               for (Long id : pids) {
                   if (!(sellerpids.contains(id))) {
                       adminprods.add(productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product", "id", id)));
                   }
               }
        return adminprods;
    }

    public List<ProductDTO> GetAllSellerProducts(){
            List<Long> sids = sellerRepo.findAll().stream().map(Sellerdata::getSid).toList();
        List<Products> ert = new ArrayList<>();
            for (Long id: sids) {
                 ert.addAll(productRepo.findBySellers_Sid(id));
            }

            return productMapper.toDTOs(ert);
    }

    @Override
    public void AddProducts(Products prod) {
        Products saved = productRepo.save(prod);
        if (saved == null) throw new RuntimeException("Failed to save product");
        productRepo.save(prod);
    }

    @Override
    public Products UpdateProdDetails(Products prod, Long id) {
        return productRepo.findById(id)
                .map( updates -> {
            updates.setPrice(prod.getPrice());
            updates.setCategory(prod.getCategory());
            updates.setName(prod.getName());
            updates.setBrand(prod.getBrand());
            updates.setDescription(prod.getDescription());
            updates.setAvailability(prod.isAvailability());
            updates.setQuantity(prod.getQuantity());
            return productRepo.save(updates);
        })
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }


    @Override
    @Transactional
    public void DeleteProdById(Long pid) {
        Products product = productRepo.findById(pid)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", pid));

        if (ordersRepo.existsByProduct_Pid(pid)) {
            throw new DeleteNotAllowedEx(DeleteBlockReason.ORDERED, "Product cannot be deleted: already ordered");
        }
        if (cartRepo.existsByProductPid(pid)) {
            throw new DeleteNotAllowedEx(DeleteBlockReason.IN_CART, "Product cannot be deleted: in cart");
        }
        if (wishlistRepo.existsByProductPid(pid)) {
            throw new DeleteNotAllowedEx(DeleteBlockReason.IN_WISHLIST, "Product cannot be deleted: in wishlist");
        }

        if (product.getSellers() != null) {
            product.getSellers().forEach(seller -> seller.getProducts().remove(product));
            product.getSellers().clear();
        }
        productRepo.delete(product);
    }

    @Override
    public List<SellerDTO> AllSellers() {
        List<Sellerdata> sellerss= sellerRepo.findAll();
        List<SellerDTO> data =sellerss.stream().map(sellerMapper::toDTO).collect(Collectors.toList());
        return data;
    }

    @Override
    public List<OrdersDTO> GetAllOrders() {
       List<Orders> data = ordersRepo.findAll();
         List<OrdersDTO> data1=  ordersMapper.toDTOs(data);
         return data1;
    }


}
