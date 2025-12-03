import React, { useEffect, useState } from "react";
import ProductCarousel from "./ProductCarousel.jsx";
import ProductGrid from "./ProductGrid.jsx";
import HorizontalProductSlider from "../HorizontalProductSlider.jsx";
import { getAllProducts, getProductByCategories } from "/src/Services/RestAPI.js";

function HomePage() {
    const [allProducts, setAllProducts] = useState([]);
    const [categoryLists, setCategoryLists] = useState([]); // [{ category, products: [] }, ...]
    const numRows = 4; // how many category slider rows to show

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getAllProducts();
                const list = res?.data || [];
                setAllProducts(list);


                const categoryCounts = list.reduce((acc, p) => {
                    const cat = (p.category || "Uncategorized").toString().trim();
                    if (!acc[cat]) acc[cat] = 0;
                    acc[cat]++;
                    return acc;
                }, {});


                const sortedCategories = Object.keys(categoryCounts)
                    .sort((a, b) => categoryCounts[b] - categoryCounts[a]);


                const topCats = sortedCategories.slice(0, numRows);


                const fetches = topCats.map(async (cat) => {
                    try {

                        const r = await getProductByCategories(cat);
                        const catProducts = r?.data || [];
                        return { category: cat, products: catProducts };
                    } catch (err) {
                        console.warn("Failed to fetch products for category", cat, err);

                        const catProducts = list.filter((p) => (p.category || "").toString().trim() === cat);
                        return { category: cat, products: catProducts };
                    }
                });

                const results = await Promise.all(fetches);
                setCategoryLists(results);
            } catch (err) {
                console.error("Failed to load products or categories", err);
            }
        };

        load();
    }, []);

    return (
        <div className="container">
            <ProductCarousel />

            <h3 className="mt-5">All Products</h3>
            <ProductGrid products={allProducts} />

            <div className="categories-sliders mt-4">
                {categoryLists.length === 0 ? (

                    <div className="text-center py-4 text-muted">Loading categories…</div>
                ) : (
                    categoryLists.map(({ category, products }) => (
                        <HorizontalProductSlider
                            key={category}
                            id={`cat-${category}`}
                            title={category}
                            products={products}
                        />
                    ))
                )}
            </div>


        </div>
    );
}

export default HomePage;