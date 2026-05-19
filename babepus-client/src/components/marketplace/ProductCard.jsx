import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { formatCurrency } from "../../utils/currency";
import { resolveImageUrl } from "../../utils/image";

const ProductCard = ({ product, onWishlistToggle }) => (
  <article className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
    <div className="relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
          {product.imageUrl ? (
            <img
              src={resolveImageUrl(product.imageUrl)}
              alt={product.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-lime-50 text-3xl font-black text-emerald-700">
              BP
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge value={product.conditionLabel} />
          </div>
        </div>
      </Link>
      {onWishlistToggle ? (
        <button
          className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-2 text-sm font-black text-emerald-700 shadow-soft backdrop-blur"
          onClick={() => onWishlistToggle(product)}
        >
          {product.isWishlisted ? "Saved" : "Save"}
        </button>
      ) : null}
    </div>
    <Link to={`/product/${product.id}`} className="block p-4">
      <p className="line-clamp-2 min-h-11 text-sm font-black leading-5 text-slate-950">{product.title}</p>
      <p className="mt-2 text-lg font-black text-emerald-700">{formatCurrency(product.price)}</p>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
        <span className="line-clamp-1">{product.category?.name}</span>
        <span>{product.seller?.ratingAverage || "0.00"} bintang</span>
      </div>
      <p className="mt-2 line-clamp-1 text-xs font-medium text-slate-500">{product.faculty || product.campusLocation}</p>
    </Link>
  </article>
);

export default ProductCard;
