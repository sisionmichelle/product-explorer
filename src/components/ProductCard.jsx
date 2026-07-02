function ProductCard({ product, onClick }) {
  return (
    <div className="product-card" onClick={onClick}>
      <img
        src={product.image}
        alt={product.title}
        width="150"
      />
      <h2>{product.title}</h2>
      <p>Category: {product.category}</p>
      <p>Price: Ksh {product.price}</p>
      <p>Rating: ⭐ {product.rating.rate}</p>
    </div>
  );
}

export default ProductCard;