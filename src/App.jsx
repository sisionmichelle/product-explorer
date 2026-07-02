import React, { useState, useEffect } from 'react'
import './App.css'
import ProductCard from "./components/ProductCard";

function App() {

  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  useEffect(() => {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setProducts(data);
    });
}, []);
 const filteredProducts = products.filter((product) => {
  const matchesSearch = product.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const matchesCategory =
    selectedCategory === "All" ||
    product.category === selectedCategory;

  return matchesSearch && matchesCategory;

});
const sortedProducts = [...filteredProducts];
  if (sortOption === "low-high") {
  sortedProducts.sort((a, b) => a.price - b.price);
} else if (sortOption === "high-low") {
  sortedProducts.sort((a, b) => b.price - a.price);
}
console.log("Selected Product:", selectedProduct);

  return (
  
    <div>
      <h1>Product Explorer</h1>
      <input
  type="text"
  placeholder="Search products..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
/>
    <select
  value={selectedCategory}
  onChange={(event) => setSelectedCategory(event.target.value)}
>
  <option value="All">All</option>
  <option value="electronics">Electronics</option>
  <option value="jewelery">Jewelery</option>
  <option value="men's clothing">Men's Clothing</option>
  <option value="women's clothing">Women's Clothing</option>
</select>
<select
  value={sortOption}
  onChange={(event) => setSortOption(event.target.value)}
>
  <option value="default">Default</option>
  <option value="low-high">Price: Low to High</option>
  <option value="high-low">Price: High to Low</option>
</select>
{sortedProducts.map((product) => (
  <div key={product.id}>
    <ProductCard
      product={product}
      onClick={() => setSelectedProduct(product)}
    />
  </div>
))}
         

          {selectedProduct && (
            <div className="modal">
              <div className="modal-content">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  width="200"
                />

                <h2>{selectedProduct.title}</h2>

                <p><strong>Category:</strong> {selectedProduct.category}</p>

                <p><strong>Price:</strong> Ksh {selectedProduct.price}</p>

                <p><strong>Rating:</strong> ⭐ {selectedProduct.rating?.rate}</p>

                <p>{selectedProduct.description}</p>

                <button onClick={() => setSelectedProduct(null)}>
                Close
                </button>
              </div>
            </div>
          )}
      
    </div>
  )
}
export default App;