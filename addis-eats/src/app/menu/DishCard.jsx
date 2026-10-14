import Image from "next/image";
import Link from "next/link";
import AddToCart from "./AddToCart";
import FavoriteButton from "./FavoriteButton";

export default function DishCard({ dish, priority = false }) {
  return (
    <article className="dish-card">
      <div className="dish-card-image-wrap">
        <Image
          src={dish.image}
          alt={`Photo of ${dish.name}`}
          width={400}
          height={280}
          sizes="(max-width: 650px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="dish-card-img"
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
        />
        <span className="tag">{dish.cuisine}</span>
        <FavoriteButton dish={dish} />
      </div>
      <div className="dish-card-body">
        <p className="dish-rating">★ {dish.rating}</p>
        <h2>
          <Link href={`/menu/${dish.id}`}>{dish.name}</Link>
        </h2>
        <p className="dish-description">{dish.summary}</p>
        <div className="dish-card-actions">
          <span className="dish-price">{dish.price} ETB</span>
          <AddToCart dish={dish} />
        </div>
      </div>
    </article>
  );
}
