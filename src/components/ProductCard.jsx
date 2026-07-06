function ProductCard({
  product,
  onClick,
  onFavoriteClick,
  isFavorite,
  onAddToCart,
  quantity,
  onIncrease,
  onDecrease,
  onEdit,
  onDelete,
}) {
  return (
    <div className="product-card" onClick={onClick}>
      <img
        src={product.image}
        alt={product.title}
        width="150"
      />

      <h2>{product.title}</h2>

      <p>Category: {product.category}</p>

      <p className="price">Ksh {product.price}</p>

      <p>⭐ {product.rating.rate}</p>

      {/* Favorite */}
      <div className="product-actions">
        <button
          className="favorite-btn"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick();
          }}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Cart Controls */}
      {quantity === 0 ? (
        <button
          className="add-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
        >
          🛒 Add to Cart
        </button>
      ) : (
        <div className="quantity-controls">
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
      )}

      {/* Edit & Delete */}
      <div className="admin-actions">
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          ✏️ Edit
        </button>

        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
