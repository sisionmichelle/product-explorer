import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import "../App.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png.png";


function Home() {

  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState(() => {
  const savedSearch = localStorage.getItem("searchTerm");
  return savedSearch ? savedSearch : "";
});
  const [selectedCategory, setSelectedCategory] = useState(() => {
  const savedSelectedCategory = localStorage.getItem("selectedCategory");
  return savedSelectedCategory? savedSelectedCategory: "All";
});
  const [sortOption, setSortOption] = useState(() => {
  const savedSortOption = localStorage.getItem("sortOption");
  return savedSortOption? savedSortOption: "default";
});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState(() => {
  const savedFavorites = localStorage.getItem("favorites");
   return savedFavorites ? JSON.parse(savedFavorites) : [];
});

  const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem("cart");

  return savedCart ? JSON.parse(savedCart) : [];
});
  const [showCart, setShowCart] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
  const savedDarkMode= localStorage.getItem("darkMode");

  return savedDarkMode ? JSON.parse(savedDarkMode) : false;
});
const navigate = useNavigate();
const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 6;
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [recentlyViewed, setRecentlyViewed] = useState(() => {
  const saved = localStorage.getItem("recentlyViewed");
  return saved ? JSON.parse(saved) : [];
});
const [editingProduct, setEditingProduct] = useState(null);

const [editedTitle, setEditedTitle] = useState("");

const [editedPrice, setEditedPrice] = useState("");
  
 useEffect(() => {
  setLoading(true);

  fetch("https://fakestoreapi.com/products")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }

      return response.json();
    })
    .then((data) => {
      setProducts(data);
      setLoading(false);
    })
    .catch((error) => {
      setError(error.message);
      setLoading(false);
    });
}, []);
  useEffect(() => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}, [cart]);
useEffect(() => {
  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
}, [favorites]);
useEffect(() => {
  localStorage.setItem(
    "darkMode",
    JSON.stringify(darkMode)
  );
}, [darkMode]);
useEffect(() => {
  localStorage.setItem(
    "searchTerm",
    searchTerm
  );
}, [searchTerm]);
useEffect(() => {
  localStorage.setItem(
    "selectedCategory",
    selectedCategory
  );
}, [selectedCategory]);
useEffect(() => {
  localStorage.setItem(
    "sortOption",
    sortOption
  );
}, [sortOption]);
useEffect(() => {
  const saved = localStorage.getItem("recentlyViewed");

  if (saved) {
    setRecentlyViewed(JSON.parse(saved));
  }
}, []);
  function toggleFavorite(product) {
  if (favorites.includes(product.id)) {
    setFavorites(
      favorites.filter((id) => id !== product.id)
    );
  } else {
    setFavorites([
      ...favorites,
      product.id
    ]);
  }
}
function addToCart(product) {
  const existingProduct = cart.find(
    (item) => item.id === product.id
  );

  if (existingProduct) {
    setCart(
      cart.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }

        return item;
      })
    );
  } else {
    setCart([
      ...cart,
      {
        ...product,
        quantity: 1
      }
    ]);
  }
}
function increaseQuantity(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    setCart(
      cart.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }
        return item;
      })
    );
  }
}

function decreaseQuantity(product) {
 const existingItem = cart.find(
    (item) => item.id === product.id
  );

  if (existingItem.quantity === 1) {
    setCart(
      cart.filter((item) => item.id !== product.id)
    );
  } else {
    setCart(
      cart.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: item.quantity - 1
          };
        }
        return item;
      })
    );
  }
}
function deleteProduct(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) return;

  fetch(`https://fakestoreapi.com/products/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      setProducts(
        products.filter((product) => product.id !== id)
      );
    })
    .catch((error) => {
      console.error(error);
    });
}
function updateProduct() {
  fetch(
    `https://fakestoreapi.com/products/${editingProduct.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...editingProduct,
        title: editedTitle,
        price: Number(editedPrice),
      }),
    }
  )
    .then((response) => response.json())
    .then((updatedProduct) => {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                title: updatedProduct.title,
                price: updatedProduct.price,
              }
            : product
        )
      );

      setEditingProduct(null);
    })
    .catch((error) => {
      console.error(error);
    });
}
function openEditModal(product) {
  setEditingProduct(product);
  setEditedTitle(product.title);
  setEditedPrice(product.price);
}
const total = cart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);
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
} else if (sortOption === "rating-high") {
  sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
} else if (sortOption === "rating-low") {
  sortedProducts.sort((a, b) => a.rating.rate - b.rating.rate);
}
console.log("Selected Product:", selectedProduct);
const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

const currentProducts = sortedProducts.slice(
  indexOfFirstProduct,
  indexOfLastProduct
);
const totalPages = Math.ceil(
  sortedProducts.length / productsPerPage
);
if (loading) {
  return (
    <div className="app-container">
      <h2>Loading products...</h2>
    </div>
  );
}
if (error) {
  return (
    <div className="app-container">
      <h2>{error}</h2>
    </div>
  );
}
  return (
  
   <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <div className="header">
        <div>
  <div className="logo">
  <img src={logo} alt="Insta Find Logo" />

  <div>
    <h1>Product Explorer</h1>
    <p>Explore • Discover • Shop</p>
  </div>
</div>
  <p>Discover amazing products</p>
    </div>
    <div className="header-icons">
<button
onClick={()=> setDarkMode(!darkMode)}
>
  {darkMode ? "☀️" : "🌙"}
</button>
<button>
❤️ {favorites.length}
</button>
<button
  onClick={() => setShowHistory(true)}
>
  🕒 {recentlyViewed.length}
</button>
  <button className= "cart-button" onClick={() => setShowCart(true)}>
    🛒 
    <span className= "cart-count">
    {cart.reduce((sum, item) => sum + item.quantity, 0)}
    </span>
  </button>
</div>
</div>

      <div className= "toolbar">
      <input
  type="text"
  placeholder="Search products..."
  value={searchTerm}
  onChange={(event) =>{ setSearchTerm(event.target.value)
    setCurrentPage(1);
  }}
/>
    <select
  value={selectedCategory}
  onChange={(event) =>{ setSelectedCategory(event.target.value)
    setCurrentPage(1)
  }}
>
  <option value="All">All</option>
  <option value="electronics">Electronics</option>
  <option value="jewelery">Jewelery</option>
  <option value="men's clothing">Men's Clothing</option>
  <option value="women's clothing">Women's Clothing</option>
</select>
<select
  value={sortOption}
  onChange={(event) => {setSortOption(event.target.value)
    setCurrentPage(1)
  }}
>
  <option value="default">Default</option>
  <option value="low-high">Price: Low to High</option>
  <option value="high-low">Price: High to Low</option>
  <option value="rating-high">Rating: High to Low</option>
  <option value="rating-low">Rating: Low to High</option>
</select>
</div>
<div className="products-grid">
  {currentProducts.length === 0 ? (
    <div className="empty-results">
      <h2>👀 WOMP WOMP</h2>
      <p>Try another search or category.</p>
    </div>
  ) : (
    currentProducts.map((product) => {
      const cartItem = cart.find(
        (item) => item.id === product.id
      );

      return (
        <div key={product.id}>
          <ProductCard
            product={product}
            onClick={() => navigate(`/product/${product.id}`)}
            onFavoriteClick={() => toggleFavorite(product)}
            isFavorite={favorites.includes(product.id)}
            onAddToCart={() => addToCart(product)}
            onIncrease={() => increaseQuantity(product)}
            onDecrease={() => decreaseQuantity(product)}
            quantity={cartItem ? cartItem.quantity : 0}
            onEdit={() => openEditModal(product)}
            onDelete={() => deleteProduct(product.id)}
            
          />
        </div>
      );
    })
  )}
</div>
    <div className="pagination">
  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>  

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
          {editingProduct && (
  <div className="modal">
    <div className="modal-content">
      <h2>✏️ Edit Product</h2>

      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="Product Title"
      />

      <input
        type="number"
        value={editedPrice}
        onChange={(e) => setEditedPrice(e.target.value)}
        placeholder="Price"
      />

      <div style={{ marginTop: "20px" }}>
        <button
          className="checkout-btn"
          onClick={updateProduct}
        >
          Save Changes
        </button>

        <button
          onClick={() => setEditingProduct(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
          {showCart && (
  <div className="cart-sidebar">
    <h2>🛒 Shopping Cart</h2>
        {cart.length===0? (
          <p>Your cart is empty.</p>
        ): (
        <>
    {cart.map((item) => (
  <div className="cart-item" key={item.id}>
    <img
      src={item.image}
      alt={item.title}
      width="60"
    />

    <div className="cart-info">
      <h4>{item.title}</h4>
      <p>Ksh {(item.price* item.quantity).toFixed(2)}</p>

      <div className="quantity-controls">
        <button onClick={() => decreaseQuantity(item)}>
          ➖
        </button>

        <span>{item.quantity}</span>

        <button onClick={() => increaseQuantity(item)}>
          ➕
        </button>
      </div>
    </div>
  </div>
))}
   <hr />

        <h3>Total: Ksh {total.toFixed(2)}</h3>

        <button className="checkout-btn">
          Checkout
        </button>
      </>
        )}
    <button onClick={() => setShowCart(false)}>
      Close
    </button>
  </div>
)}
{showHistory && (
  <div className="history-sidebar">
    <h2>🕒 Recently Viewed</h2>

    {recentlyViewed.length === 0 ? (
      <p>No recently viewed products.</p>
    ) : (
      recentlyViewed.map((item) => (
        <div
          key={item.id}
          className="history-item"
          onClick={() => navigate(`/product/${item.id}`)}
        >
          <img
            src={item.image}
            alt={item.title}
            width="60"
          />

          <div>
            <h4>{item.title}</h4>

            <p>Ksh {item.price}</p>
          </div>
        </div>
      ))
    )}

    <button onClick={() => setShowHistory(false)}>
      Close
    </button>
  </div>
)}
      
    </div>
  )
}
export default Home;