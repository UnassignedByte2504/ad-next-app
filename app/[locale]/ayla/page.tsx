"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShoppingCart,
  Moon,
  Sparkles,
  ChevronDown,
  Instagram,
  Mail,
  Heart,
} from "lucide-react";

// Components
import { Toast } from "@atoms";
import { MagicText, ReviewCard } from "@molecules";
import { FloatingStars, GlowCTA, ProductModal, Cart, ProductCard } from "@organisms";

// Data
import { products, reviews } from "@/data/ayla";

// Hooks
import { useInView } from "@hooks";

// Theme
import {
  primary,
  secondary,
  accent,
  neutral,
  springs,
  fontFamilies,
} from "@/app/ui/theme";

// Types
import type { AylaProduct, AylaCartItem, AylaToast } from "@types";

// =============================================================================
// ANIMATED SECTION WRAPPER
// =============================================================================

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) => {
  const [ref, isInView] = useInView<HTMLDivElement>({
    threshold: 0.15,
    triggerOnce: true,
  });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        ...springs.gentle,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
};

// =============================================================================
// CSS KEYFRAMES
// =============================================================================

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Nunito+Sans:wght@300;400;500;600&display=swap');

  .font-serif {
    font-family: 'Cormorant Garamond', Georgia, serif;
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: var(--star-opacity, 0.4); transform: scale(1); }
    50% { opacity: calc(var(--star-opacity, 0.4) * 1.5); transform: scale(1.15); }
  }
`;

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function AylaDesignsLanding() {
  // State
  const [cartItems, setCartItems] = useState<AylaCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<AylaProduct | null>(
    null
  );
  const [toast, setToast] = useState<AylaToast>({
    visible: false,
    message: "",
    variant: "success",
  });

  // ==========================================================================
  // SCROLL TRACKING
  // ==========================================================================

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ==========================================================================
  // TOAST HANDLER
  // ==========================================================================

  const showToast = (message: string, variant: AylaToast["variant"] = "success") => {
    setToast({ visible: true, message, variant });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2500);
  };

  // ==========================================================================
  // CART HANDLERS
  // ==========================================================================

  const addToCart = (product: AylaProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        showToast(`${product.name} actualizado`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`${product.name} añadido`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        fontFamily: fontFamilies.body,
        background: neutral[50],
        color: neutral[700],
      }}
    >
      <style>{GLOBAL_STYLES}</style>

      {/* ====================================================================
          NAVIGATION
          ==================================================================== */}
      <nav
        className="fixed top-0 left-0 right-0 z-30 transition-all duration-300"
        style={{
          background: scrollY > 50 ? `${neutral[50]}F2` : "transparent",
          backdropFilter: scrollY > 50 ? "blur(12px)" : "none",
          boxShadow: scrollY > 50 ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="#"
            className="font-serif text-2xl tracking-wide"
            style={{ color: neutral[800] }}
          >
            Ayla<span style={{ color: primary.main }}>.</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {["Productos", "Testimonios", "Contacto"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm tracking-wide transition-colors"
                style={{ color: neutral[600] }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = primary.dark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = neutral[600];
                }}
              >
                {item}
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full transition-colors"
            style={{ background: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${primary.light}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <ShoppingCart size={22} style={{ color: neutral[700] }} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-medium"
                style={{ background: primary.main, color: "white" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${primary.light}20, ${neutral[50]}, ${secondary.light}15)`,
          }}
        />

        {/* Decorative circle */}
        <div
          className="absolute top-20 right-10 md:right-20 w-32 md:w-48 h-32 md:h-48 rounded-full opacity-60 blur-sm"
          style={{
            background: `linear-gradient(to bottom right, ${primary.light}80, ${primary.light}40, ${neutral[100]})`,
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />

        {/* Floating stars */}
        <FloatingStars starColor={primary.light} />

        {/* Floating decorations */}
        <div
          className="absolute bottom-20 left-10"
          style={{ animation: "float 6s ease-in-out infinite" }}
        >
          <div
            className="w-16 h-16 rounded-lg rotate-45 opacity-40"
            style={{
              background: `linear-gradient(to bottom right, ${secondary.light}, ${secondary.main})`,
            }}
          />
        </div>
        <div
          className="absolute top-1/3 left-20 hidden md:block"
          style={{ animation: "float 6s ease-in-out 2s infinite" }}
        >
          <Moon size={32} style={{ color: primary.light, opacity: 0.3 }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div style={{ animation: "fadeSlideUp 1s ease-out 0.3s both" }}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{
                background: `${primary.light}33`,
                color: primary.dark,
              }}
            >
              <Sparkles size={14} />
              Diseño bohemio profesional
            </span>
          </div>

          <h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-6"
            style={{
              animation: "fadeSlideUp 1s ease-out 0.5s both",
              color: neutral[800],
            }}
          >
            Diseños que inspiran
            <br />
            <MagicText color="amber">
              <span className="italic" style={{ color: primary.main }}>
                magia
              </span>
            </MagicText>{" "}
            y
            <MagicText color="purple">
              <span style={{ color: secondary.main }}> profesionalidad</span>
            </MagicText>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{
              animation: "fadeSlideUp 1s ease-out 0.7s both",
              color: neutral[500],
            }}
          >
            Plantillas y recursos gráficos con alma bohemia para marcas que buscan
            destacar sin perder su esencia corporativa.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animation: "fadeSlideUp 1s ease-out 0.9s both" }}
          >
            <a
              href="#productos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(to right, ${primary.main}, ${primary.light})`,
                color: neutral[900],
                boxShadow: `0 8px 24px ${primary.light}66`,
              }}
            >
              Explorar Diseños
              <ChevronDown size={18} />
            </a>
            <a
              href="#testimonios"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-medium rounded-full transform transition-all duration-300 hover:shadow-lg"
              style={{
                background: `${neutral[50]}99`,
                backdropFilter: "blur(8px)",
                color: neutral[700],
                border: `1px solid ${primary.light}`,
              }}
            >
              Ver Testimonios
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} style={{ color: primary.light }} />
        </div>
      </section>

      {/* ====================================================================
          FEATURES SECTION
          ==================================================================== */}
      <section className="py-20" style={{ background: `${neutral[50]}80` }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Moon,
                iconColor: primary.dark,
                bgGradient: `linear-gradient(to bottom right, ${primary.light}66, ${primary.light}33)`,
                title: "Estética Bohemia",
                description:
                  "Elementos celestiales y orgánicos que aportan calidez y personalidad a tu marca.",
              },
              {
                icon: Sparkles,
                iconColor: secondary.main,
                bgGradient: `linear-gradient(to bottom right, ${secondary.light}66, ${secondary.light}33)`,
                title: "Profesionalidad",
                description:
                  "Diseños elegantes y versátiles que mantienen un aspecto corporativo refinado.",
              },
              {
                icon: Heart,
                iconColor: accent.main,
                bgGradient: `linear-gradient(to bottom right, ${accent.light}66, ${accent.light}33)`,
                title: "100% Editables",
                description:
                  "Plantillas fáciles de personalizar en Canva, Figma o Adobe para adaptarlas a tu marca.",
              },
            ].map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 150}>
                <div className="text-center p-8">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ background: feature.bgGradient }}
                  >
                    <feature.icon size={28} style={{ color: feature.iconColor }} />
                  </div>
                  <h3
                    className="font-serif text-xl mb-2"
                    style={{ color: neutral[800] }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: neutral[500] }}>
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          PRODUCTS SECTION
          ==================================================================== */}
      <section id="productos" className="py-24 relative">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${neutral[50]}80, ${neutral[50]}, ${secondary.light}10)`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span
                className="text-sm font-medium tracking-widest uppercase"
                style={{ color: primary.main }}
              >
                Colección
              </span>
              <h2
                className="font-serif text-4xl md:text-5xl mt-2"
                style={{ color: neutral[800] }}
              >
                Nuestros Diseños
              </h2>
              <p className="mt-4 max-w-xl mx-auto" style={{ color: neutral[500] }}>
                Cada plantilla está diseñada con amor y atención al detalle para que
                tu marca brille.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 100} className="w-full">
                <ProductCard
                  product={product}
                  onAddToCart={addToCart}
                  onViewProduct={setSelectedProduct}
                  index={index}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          TESTIMONIALS SECTION
          ==================================================================== */}
      <section
        id="testimonios"
        className="py-24"
        style={{
          background: `linear-gradient(to bottom, ${secondary.light}15, ${neutral[50]})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span
                className="text-sm font-medium tracking-widest uppercase"
                style={{ color: secondary.main }}
              >
                Testimonios
              </span>
              <h2
                className="font-serif text-4xl md:text-5xl mt-2"
                style={{ color: neutral[800] }}
              >
                Lo que dicen nuestros clientes
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CTA SECTION
          ==================================================================== */}
      <GlowCTA
        title="¿Lista para transformar tu marca?"
        subtitle="Únete a cientos de emprendedoras que ya confían en Ayla Designs para dar vida a su visión."
        ctaText="Comenzar Ahora"
        ctaHref="#productos"
      />

      {/* ====================================================================
          FOOTER
          ==================================================================== */}
      <footer
        id="contacto"
        className="py-16"
        style={{ background: neutral[800], color: neutral[300] }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="font-serif text-3xl text-white mb-4">
                Ayla<span style={{ color: primary.light }}>.</span>Designs
              </h3>
              <p
                className="max-w-md leading-relaxed"
                style={{ color: neutral[400] }}
              >
                Diseños bohemios con alma profesional. Plantillas y recursos gráficos
                para marcas que quieren destacar con estilo.
              </p>
              <div className="flex gap-4 mt-6">
                {[Instagram, Mail].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-2 rounded-full transition-colors"
                    style={{ background: neutral[700] }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = primary.main;
                      e.currentTarget.style.color = neutral[800];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = neutral[700];
                      e.currentTarget.style.color = neutral[300];
                    }}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Products links */}
            <div>
              <h4
                className="font-semibold mb-4"
                style={{ color: primary.light }}
              >
                Productos
              </h4>
              <ul className="space-y-2" style={{ color: neutral[400] }}>
                {["Planners", "Tarjetas", "Social Media", "Branding"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h4
                className="font-semibold mb-4"
                style={{ color: primary.light }}
              >
                Soporte
              </h4>
              <ul className="space-y-2" style={{ color: neutral[400] }}>
                {["FAQ", "Contacto", "Licencias", "Términos"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="mt-12 pt-8 text-center text-sm"
            style={{ borderTop: `1px solid ${neutral[700]}`, color: neutral[500] }}
          >
            <p>© 2025 Ayla Designs. Hecho con amor.</p>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          OVERLAYS
          ==================================================================== */}
      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      <Toast message={toast.message} isVisible={toast.visible} variant={toast.variant} />
    </div>
  );
}
