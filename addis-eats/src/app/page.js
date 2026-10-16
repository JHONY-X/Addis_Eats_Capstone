import Link from "next/link";
import Image from "next/image";
import { getDishes } from "./menu/dishes";
import FavoriteButton from "./menu/FavoriteButton";
import AddToCart from "./menu/AddToCart";

export const metadata = {
  title: "Addis Eats — Order Delicious Food in Addis Ababa",
  description: "Discover Ethiopian meals, burgers, pizza and drinks. Order your favourite food online with fast delivery in Addis Ababa.",
  openGraph: {
    title: "Addis Eats — Order Delicious Food in Addis Ababa",
    description: "Discover Ethiopian meals, burgers, pizza and drinks. Order your favourite food online with fast delivery in Addis Ababa.",
    type: "website",
    siteName: "Addis Eats",
    locale: "en_ET",
    images: [{ url: "/Greek_Moussaka-hero.webp", width: 1000, height: 1000, alt: "Greek Moussaka from Addis Eats" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats — Order Delicious Food in Addis Ababa",
    description: "Discover Ethiopian meals, burgers, pizza and drinks. Order your favourite food online with fast delivery in Addis Ababa.",
    images: ["/Greek_Moussaka-hero.webp"],
  },
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const dishes = await getDishes();
  const featuredDish = dishes.find((dish) => dish.name === "Japanese Ramen Soup") || dishes[0];

  return (
    <main className="lux-home home-page" id="home-page">
      <section className="lux-hero home-hero" id="hero-section">
        <div className="lux-hero-inner">
          <div className="lux-hero-copy">
            <p className="lux-eyebrow">
              Addis Ababa, Ethiopia
            </p>
            <h1 className="lux-hero-title">
              Let&apos;s Order Some<br />
              <span className="lux-hero-title-italic">Delicious Cuisines</span>
            </h1>
            <p className="lux-hero-desc">
              Discover local favorites and comforting dishes, made fresh and delivered across Addis Ababa.
            </p>
            <div className="lux-hero-actions">
              <Link className="lux-btn-primary" href="/menu">
                MENU
              </Link>
            </div>
          </div>

          <div className="lux-hero-card-wrap">
            <article className="lux-hero-card" id="hero-featured-card">
              <div className="lux-hero-card-img home-feature-image">
                <Image
                  src={featuredDish.image}
                  alt={`Photo of ${featuredDish.name}`}
                  width={440}
                  height={280}
                  priority
                  sizes="(max-width: 760px) 100vw, 42vw"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
                <span className="lux-hero-card-badge">Today&apos;s special</span>
                <FavoriteButton dish={featuredDish} />
              </div>
              <div className="lux-hero-card-info">
                <div className="lux-hero-card-meta">
                  <Link className="lux-hero-card-name" href={`/menu/${featuredDish.id}`}>
                    {featuredDish.name}
                  </Link>
                  <span className="lux-hero-card-price">{featuredDish.price} ETB</span>
                </div>
                <p className="lux-hero-card-desc">{featuredDish.summary}</p>
                <AddToCart dish={featuredDish} />
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
