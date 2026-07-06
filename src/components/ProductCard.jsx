function ProductCard({ product, onClick, onFavoriteClick, isFavorite, onAddToCart, quantity, onIncrease, onDecrease }) {
  return (
    <div className="product-card" onClick={onClick}>
      <img
        src={product.image}
        alt={product.title}
        width="150"
      />
      <h2>{product.title}</h2>
      <div className="product-actions">
        <button
        className="favorite-btn"
        onClick={(e)=>{
          e.stopPropagation();
          onFavoriteClick();

        }}
        >
           {isFavorite ? "❤️" : "🤍"}
        </button>
       {quantity===0? (
        <button
        onClick={(e)=>{
          e.stopPropagation();
          onAddToCart();
        }}
        >
         🛒 Add to Cart 
        </button>
       ):(
         <div className="quality-controls">
    <button
  onClick={(e) => {
    e.stopPropagation();
    onDecrease();
  }}
>
  ➖
</button>

<span>{quantity}</span>

<button
  onClick={(e) => {
    e.stopPropagation();
    onIncrease();
  }}
>
  ➕
</button>
  </div>
       )
       }
    </div>  
     <div className="product-details">

  <p className="category">
    {product.category}
  </p>

  <p className="rating">
    ⭐ {product.rating.rate}
  </p>

  <p className="price">
    Ksh {product.price}
  </p>

</div>
    </div>
  );
}

export default ProductCard;