import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
  const saved = localStorage.getItem("recentlyViewed");
  return saved ? JSON.parse(saved) : [];
});

 
  useEffect(() => {
  fetch(`https://fakestoreapi.com/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
      setProduct(data);

      const saved =
        JSON.parse(localStorage.getItem("recentlyViewed")) || [];

      const filtered = saved.filter(
        (item) => item.id !== data.id
      );

      const updated = [data, ...filtered].slice(0, 5);

      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(updated)
      );

      setRecentlyViewed(updated);
    });
}, [id]);

  if (!product) {
    
    return <h2>Loading product...</h2>;
    
  }

  return (
    <div className="app-container">
      <button onClick={() => navigate("/")}>
        ← Back to Products
      </button>

      <div className="modal-content">
        <img
          src={product.image}
          alt={product.title}
          width="200"
        />

        <h2>{product.title}</h2>

        <p><strong>Category:</strong> {product.category}</p>

        <p><strong>Price:</strong> Ksh {product.price}</p>

        <p><strong>Rating:</strong> ⭐ {product.rating.rate}</p>

        <p>{product.description}</p>
      </div>
    </div>
  );
}

export default ProductDetails;