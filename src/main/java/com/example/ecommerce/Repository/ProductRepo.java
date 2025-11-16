package com.example.ecommerce.Repository;

import com.example.ecommerce.Entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepo  extends JpaRepository<Products,Long> {
  Optional<List<Products>> findByCategory(String Category);

    @Query("SELECT DISTINCT p FROM Products p LEFT JOIN FETCH p.sellers WHERE p.category = :category")
    Optional<List<Products>> findProductsWithSellersByCategory(@Param("category") String category);


    @Query(value = "select * from products where concat_ws('|',category,brand,name) like %?1%", nativeQuery = true)
  List<Products> searchproducts(String kword);

     Optional<Products> findBySellers_SidAndPid(Long sid, Long pid);

     List<Products> findBySellers_Sid(Long sid);

    void deleteBySellers_SidAndPid(Long sid, Long pid);

}
