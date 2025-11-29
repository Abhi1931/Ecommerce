package com.example.ecommerce;
import com.example.ecommerce.Entity.Products;
import com.example.ecommerce.Repository.ProductRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataConfig implements CommandLineRunner {


    private final ProductRepo productRepository;

    public DataConfig(ProductRepo productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (productRepository.count() > 0) {
            System.out.println("Products already present — skipping initial data load.");
            return;
        }

        List<String> rows = List.of(
                // note: first column (id) from your CSV is ignored here so DB will assign ids
                "101,true,hassleblad,cameras,flagship,h6d-400c,1000,10,/images/hassleblad.jpg",
                "105,true,hassleblad,cameras,flagship,h6d-100c,89000,5,/images/hassle.jpg",
                "106,true,TITAN,Watches,budget,Titan X93 watch,3599,20,/images/titan-watch-X93.jpg",
                "107,true,TITAN,Watches,high-end,Titan Royalblue watch Royalblue watch,9000,17,/images/Titan-watch-Royalblue.jpg",
                "108,true,GAP,Clothing,Jeans,Gap Men's Blue jeans,2999,30,/images/GAP-Mens-Blue-Jeans.jpg",
                "109,true,GAP,Clothing,Hoodie's,Gap Men's Orange Hoodie,3999,50,/images/GAP-mens-Orange-Hoodie.jpg",
                "111,true,Sony,Smartphones,flagship,Sony 1 mark 7,140000,9,/images/Sony-1-mark6.jpg",
                "113,true,TITAN,Watches,budget,Titan X100 watch,7500,10,/images/titan-watch-X93.jpg",
                "117,true,Oneplus,Smartphones,flagship,Oneplus 15,90000,5,/images/Oneplus-nord-ce-4.jpg"
        );

        List<Products> products = new ArrayList<>(rows.size());

        for (String row : rows) {

            String[] parts = row.split(",", 9); // expect 9 columns
            if (parts.length < 9) {
                System.out.println("Skipping invalid row: " + row);
                continue;
            }
            try {
                // fields: [0]=id (ignored), [1]=availability, [2]=brand, [3]=category,
                // [4]=subcategory, [5]=name, [6]=price, [7]=quantity, [8]=imageUrl
                boolean availability = Boolean.parseBoolean(parts[1].trim());
                String brand = parts[2].trim();
                String category = parts[3].trim();
                String description = parts[4].trim();
                String name = parts[5].trim();
                double price = Double.parseDouble(parts[6].trim());
                Integer quantity = Integer.valueOf(parts[7].trim());
                String imageUrl = parts[8].trim();

                Products p = new Products(availability, brand, category, name,description, price, quantity, imageUrl);
                products.add(p);
            } catch (Exception ex) {
                System.out.println("Failed to parse row: " + row + " -> " + ex.getMessage());
            }
        }

        if (!products.isEmpty()) {
            productRepository.saveAll(products);
            System.out.println("Inserted " + products.size() + " products into DB.");
        } else {
            System.out.println("No products parsed to insert.");
        }
    }
}

