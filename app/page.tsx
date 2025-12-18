"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  supabase,
  Product,
  Testimonial,
  FarmStat,
  GalleryItem,
} from "@/lib/supabase";
import {
  Sprout,
  Package,
  Egg,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  Shield,
  Leaf,
  Zap,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import MapModal from "@/components/ui/map-modal";

const Farm3DScene = dynamic(() => import("@/components/Farm3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="animate-pulse text-green-600">Loading 3D Scene...</div>
    </div>
  ),
});

function AnimatedCounter({
  end,
  suffix = "",
}: {
  end: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, isInView]);

  return (
    <span
      ref={ref}
      className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
    >
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<FarmStat[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showCallModal, setShowCallModal] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    async function fetchData() {
      const [productsRes, testimonialsRes, statsRes, galleryRes] =
        await Promise.all([
          supabase.from("products").select("*").order("display_order"),
          supabase
            .from("testimonials")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase.from("farm_stats").select("*").order("display_order"),
          supabase
            .from("gallery")
            .select("*")
            .eq("is_featured", true)
            .order("display_order"),
        ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (galleryRes.data) setGallery(galleryRes.data);
    }

    fetchData();
  }, []);

  const productIcons: Record<string, any> = {
    broiler_chicks: Sprout,
    frozen_chicken: Package,
    eggs: Egg,
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };
  const handleWhatsAppOrder = (productName: string) => {
    const phone = "2349057253584";
    const message = `Hello Admof Farms, I would like to order ${productName}. Please share price and availability.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };
  const handleSendToWhatsApp = () => {
    const phone = "2349057253584";

    const text = `
        Hello Admof Farms 👋

        Name: ${contactForm.name}
        Email: ${contactForm.email}
        Phone: ${contactForm.phone}

        Message:
        ${contactForm.message}
  `;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              {/* <Sprout className="w-8 h-8 text-green-600" /> */}
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Admof Farms
              </span>
            </motion.div>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {["about", "products", "process", "gallery", "contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="text-gray-700 hover:text-green-600 transition-colors capitalize"
                >
                  {item}
                </a>
              )
            )}
          </div>

          {/* CALL BUTTON */}
          <Button
            onClick={() => setShowCallModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
        </div>
      </nav>

      {/* CALL MODAL */}
      {showCallModal && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40"
          onClick={() => setShowCallModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="mt-24 w-80 bg-white rounded-xl shadow-xl p-6"
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Call Admof Farms
              </h3>
              <button
                onClick={() => setShowCallModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PHONE NUMBER */}
            <a
              href="tel:+2349057253584"
              className="block text-center text-lg font-semibold text-green-600 hover:underline"
            >
              📞 +2349057253584
            </a>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/2349057253584"
              target="_blank"
              className="mt-4 block text-center text-sm text-green-600 hover:underline"
            >
              Chat on WhatsApp
            </a>

            <p className="mt-3 text-sm text-gray-500 text-center">
              Tap the number to call directly
            </p>
          </motion.div>
        </div>
      )}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
          <Farm3DScene />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 font-medium mb-4"
            >
              Smart Farming Technology
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                Smart Poultry Farming
              </span>
              <br />
              <span className="text-gray-800">for a Sustainable Future</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From Healthy Chicks to Quality Chicken: Farming with Purpose
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="#products">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6"
                >
                  Order Chicks
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 py-6"
                onClick={() => setOpenMap(true)}
              >
                Visit Our Farm
              </Button>
            </div>
          </motion.div>
        </div>

        <MapModal
          isOpen={openMap}
          onClose={() => setOpenMap(false)}
          name="Admof Farms"
          address="Ibadan, Oyo State, Nigeria"
          mapQuery="Admof Farms Ibadan Oyo State Nigeria"
        />
        <Link href="#about">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="w-6 h-10 border-2 border-green-600 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-green-600 rounded-full" />
            </div>
          </motion.div>
        </Link>
      </section>

      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                About Our Farm
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              5+ years of excellence in poultry farming
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Quality Assured",
                description:
                  "We raise broiler breeder chickens to produce strong, fast-growing broiler chicks for farmers across the country.",
              },
              {
                icon: Leaf,
                title: "Sustainable Practices",
                description:
                  "Eco-friendly farming methods that protect the environment for future generations.",
              },
              {
                icon: Zap,
                title: "Modern Technology",
                description:
                  "State-of-the-art facilities with automated climate control and feeding systems.",
              },
              {
                icon: Shield,
                title: "Quality Assured",
                description:
                  "We also grow out our own birds for hygienically processed frozen chicken, and fatten rams and goats to meet local meat demand.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 bg-gradient-to-br from-white to-green-50">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <item.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-200 to-emerald-200" />

              {[
                {
                  year: "2020",
                  title: "Farm Founded",
                  description: "Started with 500 birds",
                },
                {
                  year: "2022",
                  title: "Expansion",
                  description: "Opened second facility",
                },
                {
                  year: "2024",
                  title: "Technology Integration",
                  description: "Smart farming systems",
                },
                {
                  year: "2025",
                  title: "Present Day",
                  description: "10,000+ healthy birds",
                },
              ].map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center mb-12 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0 ? "text-right pr-12" : "text-left pl-12"
                    }`}
                  >
                    <div className="inline-block bg-white p-6 rounded-2xl shadow-lg border-2 border-green-100">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {milestone.year}
                      </div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg z-10" />
                  <div className="w-1/2" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="products"
        className="py-24 bg-gradient-to-b from-green-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Our Premium Products
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Quality you can trust, freshness guaranteed
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const IconComponent = productIcons[product.category] || Package;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="group overflow-hidden border-2 border-transparent hover:border-green-200 hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {product.description}
                      </p>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-green-600">
                          ₦ {product.price}
                        </span>
                        <span className="text-gray-500">/ {product.unit}</span>
                      </div>
                      <img
                        src={product.image_url || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 mb-2"
                      />
                      <Button
                        onClick={() => handleWhatsAppOrder(product.name)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Order Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="process" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Our Farm Process
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              From hatch to delivery, quality at every step
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                icon: Egg,
                title: "Hatch",
                description: "Premium breeding stock",
              },
              {
                icon: Sprout,
                title: "Feed",
                description: "Nutritious organic feed",
              },
              {
                icon: TrendingUp,
                title: "Grow",
                description: "Optimal conditions",
              },
              {
                icon: Package,
                title: "Process",
                description: "Hygienic processing",
              },
              {
                icon: ArrowRight,
                title: "Deliver",
                description: "Fast delivery",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <step.icon className="w-12 h-12 text-green-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-green-200 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-green-100">
              Numbers that speak for themselves
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                  <AnimatedCounter
                    end={stat.stat_value}
                    suffix={stat.stat_suffix}
                  />
                  <p className="text-xl text-green-100 mt-2">
                    {stat.stat_label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Virtual Farm Tour
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Take a look inside our modern facility
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer h-80"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-200">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                What Our Customers Say
              </span>
            </h2>
          </motion.div>

          {testimonials.length > 0 && (
            <div className="relative">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-green-100 shadow-xl">
                  <CardContent className="p-12">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonials[currentTestimonial].rating)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-6 h-6 fill-yellow-400 text-yellow-400"
                          />
                        )
                      )}
                    </div>
                    <p className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                      "{testimonials[currentTestimonial].content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {testimonials[currentTestimonial].customer_name.charAt(
                          0
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-800">
                          {testimonials[currentTestimonial].customer_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonials[currentTestimonial].customer_role} •{" "}
                          {testimonials[currentTestimonial].location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="flex justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="rounded-full border-2 border-green-600 hover:bg-green-50"
                >
                  <ChevronLeft className="w-6 h-6 text-green-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="rounded-full border-2 border-green-600 hover:bg-green-50"
                >
                  <ChevronRight className="w-6 h-6 text-green-600" />
                </Button>
              </div>

              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial
                        ? "bg-green-600 w-8"
                        : "bg-green-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <p className="text-xl text-gray-600">We'd love to hear from you</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-green-100 shadow-xl">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <Input
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            name: e.target.value,
                          })
                        }
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            email: e.target.value,
                          })
                        }
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        placeholder="+2349057253584"
                        value={contactForm.phone}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            phone: e.target.value,
                          })
                        }
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <Textarea
                        placeholder="Tell us about your requirements..."
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            message: e.target.value,
                          })
                        }
                        className="border-2 border-gray-200"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleSendToWhatsApp}
                      className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                    >
                      Send Message
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Phone</div>
                      <div className="text-gray-600">+2349057253584</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Email</div>
                      <div className="text-gray-600">info@admoffarms.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        Location
                      </div>
                      <div className="text-gray-600">Ibadan</div>
                      <div className="text-gray-600">Oyo, Nigeria 10005</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        Business Hours
                      </div>
                      <div className="text-gray-600">
                        Monday - Friday: 8:00 AM - 6:00 PM
                      </div>
                      <div className="text-gray-600">
                        Saturday: 9:00 AM - 4:00 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() =>
                  window.open("https://wa.me/2349057253584", "_blank")
                }
                className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {/* <Sprout className="w-8 h-8 text-green-500" /> */}
                <span className="text-2xl font-bold">Admof Farms</span>
              </div>
              <p className="text-gray-400">
                From Healthy Chicks to Quality Chicken: Farming with Purpose
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-green-500 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#products"
                    className="hover:text-green-500 transition-colors"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    className="hover:text-green-500 transition-colors"
                  >
                    Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-green-500 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Broiler Chicks</li>
                <li>Frozen Chicken</li>
                <li>Fresh Eggs</li>
                <li>Custom Orders</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Socials</h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/@admoffarms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition"
                >
                  <FaInstagram className="w-8 h-8 text-green-500 hover:text-white transition" />
                </a>
                <a
                  href="https://www.tiktok.com/@yadmoffarms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition"
                >
                  <FaTiktok className="w-8 h-8 text-green-500 hover:text-white transition" />
                </a>
                <a
                  href="https://wa.me/2349057253584"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition"
                >
                  <FaWhatsapp className="w-8 h-8 text-green-500 hover:text-white transition" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Admof Farms. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
