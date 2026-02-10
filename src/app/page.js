import {
  Header,
  CategorySidebar,
  HeroBanner,
  FeaturedProducts,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Header />

      <main>
        <div className="mx-auto flex max-w-[1200px] flex-col md:flex-row">
          <CategorySidebar />
          <div className="min-w-0 flex-1">
            <HeroBanner />
          </div>
        </div>

        <FeaturedProducts />
      </main>

      <Footer />
    </div>
  );
}
