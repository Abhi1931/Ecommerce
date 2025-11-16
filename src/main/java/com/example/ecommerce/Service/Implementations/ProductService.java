package com.example.ecommerce.Service.Implementations;

import com.example.ecommerce.DTO.ProductDTO;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Entity.Sellerdata;
import com.example.ecommerce.Mapper.ProductMapper;
import com.example.ecommerce.Repository.ProductRepo;
import com.example.ecommerce.Repository.SellerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;


@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private SellerRepo sellerRepo;

    @Autowired
    private ProductMapper productMapper;

    private ProductDTO productDTO;

    public Optional<ProductDTO> getProdById(Long id) {

        return productRepo.findById(id).map(productMapper::toDTO);
    }

    public Optional<ProductDTO>  UpdateProdDetails(ProductDTO updates,Long sid, Long id) {

        productRepo.findBySellers_SidAndPid(sid,id).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"No product is there for this seller") );
        Products p = new Products();
        p.setPid(updates.getPid());
        p.setDescription(updates.getDescription());
        p.setName(updates.getName());
        p.setBrand(updates.getBrand());
        p.setAvailability(updates.isAvailability());
        p.setCategory(updates.getCategory());
        p.setQuantity(updates.getQuantity());
        p.setImageUrl(updates.getImageUrl());
        p.setPrice(updates.getPrice());
        Optional<Products> ps = productRepo.findById(id);

        return ps.map(productMapper::toDTO);
    }



    public String AddProducts(Long sellerid, ProductDTO prod) {
                   Sellerdata sellerdata= sellerRepo.findById(sellerid).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
             Products product= productMapper.toEntity(prod);
             product.setSellers(Set.of(sellerdata));

             Products saved = productRepo.save(product);

              if (sellerdata.getProducts()== null){
                  sellerdata.setProducts(new HashSet<>());
              }
              sellerdata.getProducts().add(saved);
                 sellerRepo.save(sellerdata);
                return saved.getPid() != null ? "saved" : "not saved";

    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getByCategories(String category) {
        List<Products> categoryproducts = productRepo.findProductsWithSellersByCategory(category).orElseThrow(() ->new ResponseStatusException(HttpStatus.NOT_FOUND,"not found"));

        return productMapper.toDTOs(categoryproducts);
    }

    public List<ProductDTO> searchprod(String kword) {
       List<Products> jo = productRepo.searchproducts(kword);
        return productMapper.toDTOs(jo);

    }
}
