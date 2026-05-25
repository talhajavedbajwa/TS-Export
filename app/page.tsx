"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

/* ---------------- FIREBASE ---------------- */

const firebaseConfig = {
  apiKey: "AIzaSyCLMaaMNBeoNrtJ19dMff1G5nwR5yI_znE",
  authDomain: "ts-exports.firebaseapp.com",
  databaseURL: "https://ts-exports-default-rtdb.firebaseio.com",
  projectId: "ts-exports",
  storageBucket: "ts-exports.firebasestorage.app",
  messagingSenderId: "328381543681",
  appId: "1:328381543681:web:ba0d580d228e509ed61700",
  measurementId: "G-JSYKBLLZGR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------------- APP ---------------- */

export default function Page() {

  const [user, setUser] = useState<any>(null);
  const [admin, setAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const [view, setView] = useState("home");
 const [selectedCategory, setSelectedCategory] = useState("");
useEffect(() => {

  // NORMAL PAGE CHANGE
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  // CATEGORY PRODUCTS SCROLL
  if (view === "shop" && selectedCategory) {

    setTimeout(() => {

      const section =
        document.getElementById("products-section");

      section?.scrollIntoView({
        behavior: "smooth"
      });

    }, 100);

  }

}, [view, selectedCategory]);

/* POLICY PAGES */
const policyPages = [
  "privacy",
  "terms",
  "shipping"
];

  const [search, setSearch] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");

  const [products, setProducts] = useState<any[]>([]);
// CATEGORY FILTER (NEW)

const [currentSlide, setCurrentSlide] = useState(0);
/* BLOG SYSTEM */
const [selectedBlog, setSelectedBlog] = useState<any>(null);

const blogs = [

  {
    id: 1,
    title: "How Premium Sportswear Is Manufactured",
    category: "Manufacturing",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    content:
      "TS Exports follows a complete premium manufacturing workflow including fabric sourcing, cutting, sublimation printing, stitching, quality inspection and export packaging. Every product is developed with export-quality standards to ensure durability, comfort and elite performance."
  },

  {
    id: 2,
    title: "OEM & Private Label Production Explained",
    category: "OEM Services",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    content:
      "OEM manufacturing allows global brands to build custom sportswear under their own brand identity. TS Exports provides logo printing, labels, packaging, custom designs and full-scale private label production for startups and established companies."
  },

  {
    id: 3,
    title: "Why Sialkot Leads The Sportswear Industry",
    category: "Industry",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    content:
      "Sialkot is globally recognized for sports manufacturing excellence. The city produces world-class sportswear, footballs and athletic apparel for international brands due to its skilled workforce, manufacturing expertise and export infrastructure."
  },

  {
    id: 4,
    title: "How To Start Your Own Sportswear Brand",
    category: "Branding",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    content:
      "Starting a sportswear brand requires strong manufacturing partnerships, quality fabrics, reliable production and premium branding. TS Exports helps startups build collections from concept development to final export delivery."
  }

];
  // ABOUT PAGE DATA (PREMIUM B2B STRUCTURE)

const aboutStats = [
  { label: "Global Clients", value: "50+" },
  { label: "Products Exported", value: "20K+" },
  { label: "Countries Served", value: "15+" },
  { label: "Production Support", value: "24/7" }
];

const whyUs = [
  {
    title: "Premium Manufacturing",
    desc: "We use high-quality performance fabrics and export-grade stitching standards trusted by global brands."
  },
  {
    title: "OEM & Private Label",
    desc: "We build your brand from scratch — custom logos, designs, packaging, and full private label production."
  },
  {
    title: "Fast Production Cycle",
    desc: "Optimized manufacturing workflow ensures quick sampling and fast bulk production timelines."
  },
  {
    title: "Global Export Experience",
    desc: "We supply sportswear to multiple countries with reliable logistics and export documentation."
  }
];

const whatWeProvide = [
  "Custom Sportswear Manufacturing",
  "Football Kits & Team Uniforms",
  "Gym & Fitness Apparel",
  "Cricket Uniform Production",
  "Private Label Branding",
  "Bulk Export Orders",
  "Sample Development (5–7 Days)",
  "Worldwide Shipping Support"
];

const [contactForm, setContactForm] = useState({
  name: "",
  email: "",
  company: "",
  message: ""
});
const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    moq: ""
  });

  /* ---------------- AUTH ---------------- */

  useEffect(() => {

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (u?.email === "admin@tsexports.com") {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    });

    loadProducts();

    return () => unsub();

  }, []);

  /* ---------------- AUTO HERO SLIDER ---------------- */

useEffect(() => {

  const interval = setInterval(() => {

    setCurrentSlide((prev) =>
      prev === 2 ? 0 : prev + 1
    );

  }, 4000);

  return () => clearInterval(interval);

}, []);

  /* ---------------- LOAD PRODUCTS ---------------- */

  async function loadProducts() {

    const snap = await getDocs(collection(db, "products"));

    setProducts(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }))
    );
  }

  /* ---------------- LOGIN ---------------- */

  async function login() {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function register() {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    signOut(auth);
  }

  /* ---------------- ADMIN ---------------- */

  async function addProduct() {

    if (!admin) {
      return alert("Not admin");
    }

    await addDoc(collection(db, "products"), form);

    setForm({
      name: "",
      price: "",
      category: "",
      image: "",
      moq: ""
    });

    loadProducts();
  }

  async function deleteProduct(id: any) {

    if (!admin) return;

    await deleteDoc(doc(db, "products", id));

    loadProducts();
  }

  /* ---------------- CONTACT FORM ---------------- */

async function sendContactInquiry() {

  // EMAIL VALIDATION
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !contactForm.name ||
    !contactForm.email ||
    !contactForm.message
  ) {
    return alert("Please fill all required fields.");
  }

  if (!emailRegex.test(contactForm.email)) {
    return alert("Please enter a valid email address.");
  }

  // SAVE TO FIREBASE
  await addDoc(collection(db, "contactMessages"), {
    ...contactForm,
    createdAt: new Date().toISOString()
  });

  // CLEAR FORM
  setContactForm({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  alert("Message sent successfully!");
}

/* ---------------- HERO SLIDES ---------------- */

const heroSlides = [

  {
    title: "BUILT FOR GLOBAL BRANDS",
    subtitle:
      "Premium sportswear manufacturing with export-quality production and worldwide delivery.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
  },

  {
    title: "PERFORMANCE MEETS LUXURY",
    subtitle:
      "Elite fabrics, precision stitching and premium athletic apparel for modern brands.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a"
  },

  {
    title: "OEM & PRIVATE LABEL",
    subtitle:
      "Custom manufacturing solutions for clubs, startups and global sportswear companies.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234"
  }

];

  /* ---------------- FILTER ---------------- */
// CATEGORY BLOCKS DATA (WEZIO STYLE)
const categories = [

  {
    name: "Football Uniforms",
    img: "https://images.unsplash.com/photo-1551958219-acbc608c6377"
  },

  {
    name: "Gym Wear",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
  },

  {
    name: "Cricket Uniforms",
    img: "https://images.unsplash.com/photo-1624880357913-a8539238245b"
  },

  {
    name: "Tracksuits",
    img: "https://images.unsplash.com/photo-1523398002811-999ca8dec234"
  },

  {
    name: "Hoodies",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
  },

  {
    name: "Compression Wear",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a"
  },

  {
    name: "Training Wear",
    img: "https://images.unsplash.com/photo-1514996937319-344454492b37"
  },

  {
    name: "Basketball Uniforms",
    img: "https://images.unsplash.com/photo-1546519638-68e109498ffc"
  }

];

  const filteredProducts = products.filter((p: any) => {

  const matchSearch =
    p.name?.toLowerCase().includes(search.toLowerCase());

  const matchCategory =
    selectedCategory ? p.category === selectedCategory : true;

  return matchSearch && matchCategory;
});

  /* ---------------- UI ---------------- */

  return (

    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}

      <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-5 border-b border-white/10 bg-black">

        <h1 className="font-bold text-2xl tracking-wide">
          TS EXPORTS
        </h1>

        <div className="flex gap-6 text-sm">

          <button onClick={() => setView("home")}>
            Home
          </button>
<div className="relative group">

  {/* MAIN PRODUCTS BUTTON */}
  <button
    onClick={() => {
      setSelectedCategory("");
      setView("shop");
    }}
    className="hover:text-gray-300 transition"
  >
    Products
  </button>

  {/* DROPDOWN */}
  <div className="absolute top-full left-0 mt-4 w-72 bg-black border border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">

    {/* ALL PRODUCTS */}
<button
  onClick={() => {
    setSelectedCategory("");
    setView("shop");
  }}
  className="flex items-center gap-2 hover:text-gray-300 transition font-medium"
>

  Products

  {/* LUXURY CHEVRON */}
  <svg
    className="w-4 h-4 mt-[1px] group-hover:rotate-180 transition duration-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>

</button>

    {/* CATEGORY LIST */}
    {categories.map((cat, i) => (

      <button
        key={i}
        onClick={() => {

          setSelectedCategory(cat.name);

          setView("shop");

          setTimeout(() => {

            const section =
              document.getElementById("products-section");

            section?.scrollIntoView({
              behavior: "smooth"
            });

          }, 100);

        }}
        className="w-full text-left px-6 py-4 hover:bg-white hover:text-black transition"
      >
        {cat.name}
      </button>

    ))}

  </div>

</div>

          <button onClick={() => setView("about")}>
            About
          </button>

          {admin && (
          <button onClick={() => setView("admin")}>
            Admin
          </button>
          )}

          <button onClick={() => setView("blogs")}>
  Blogs
</button>

          <button onClick={() => setView("contact")}>
            Contact
          </button>
        </div>

      </div>

  {/* HOME */}
{view === "home" && (

  <div>

{/* LUXURY HERO SLIDER */}
<section className="relative h-screen overflow-hidden">

  {/* SLIDES */}
  {heroSlides.map((slide, index) => (

    <div
      key={index}
      className={`absolute inset-0 transition-all duration-1000 ${
        currentSlide === index
          ? "opacity-100 scale-100"
          : "opacity-0 scale-105"
      }`}
    >

      {/* IMAGE */}
      <img
        src={slide.image}
        className="w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/65" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-6">

        <div className="max-w-4xl">

          <p className="uppercase tracking-[10px] text-gray-400 text-sm mb-6">
            TS EXPORTS
          </p>

          <h1 className="text-6xl md:text-8xl font-bold leading-tight animate-pulse">

            {slide.title}

          </h1>

          <p className="text-gray-300 text-lg md:text-xl leading-8 mt-8 max-w-2xl mx-auto">

            {slide.subtitle}

          </p>

          <button
            onClick={() => setView("shop")}
            className="mt-10 bg-white text-black px-8 py-4 rounded-full text-lg hover:scale-105 transition"
          >
            Explore Collection
          </button>

        </div>

      </div>

    </div>

  ))}

  {/* SLIDER DOTS */}
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">

    {heroSlides.map((_, index) => (

      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-3 h-3 rounded-full transition ${
          currentSlide === index
            ? "bg-white scale-125"
            : "bg-white/40"
        }`}
      />

    ))}

  </div>

</section>

{/* CATEGORY SECTION */}
<section className="py-32 px-6">

  <div className="text-center mb-16">
    <h1 className="text-5xl font-bold">
      Premium Categories
    </h1>
    <p className="text-gray-400 mt-4">
      Tap a category to explore products
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">

    {categories.map((cat, i) => (

      <div
        key={i}
        onClick={() => {
          setSelectedCategory(cat.name);
          setView("shop");
        }}
        className="relative h-[420px] rounded-3xl overflow-hidden cursor-pointer group"
      >

        <img
          src={cat.img}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="absolute bottom-8 left-8">
          <h2 className="text-3xl font-bold">
            {cat.name}
          </h2>
          <p className="text-gray-300 text-sm mt-2">
            View Collection →
          </p>
        </div>

      </div>

    ))}

  </div>

</section>
    {/* COLLECTIONS */}
    <section className="py-32 px-6 bg-black">

      <div className="text-center mb-20">

        <p className="uppercase tracking-[8px] text-gray-500 text-sm">
          COLLECTIONS
        </p>

        <h1 className="text-5xl md:text-7xl font-bold mt-4">
          Premium Categories
        </h1>

      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {/* CARD 1 */}
        <div className="group relative overflow-hidden rounded-3xl h-[500px]">

          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-10 left-10">

            <h2 className="text-4xl font-bold">
              Football Wear
            </h2>

          </div>

        </div>

        {/* CARD 2 */}
        <div className="group relative overflow-hidden rounded-3xl h-[500px]">

          <img
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-10 left-10">

            <h2 className="text-4xl font-bold">
              Gym Wear
            </h2>

          </div>

        </div>

        {/* CARD 3 */}
        <div className="group relative overflow-hidden rounded-3xl h-[500px]">

          <img
            src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-10 left-10">

            <h2 className="text-4xl font-bold">
              Cricket Uniforms
            </h2>

          </div>

        </div>

      </div>

    </section>

    {/* STATS */}
    <section className="py-32 px-6">

      <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto text-center">

        <div className="border border-white/10 p-10 rounded-3xl bg-white/[0.02]">
          <h1 className="text-6xl font-bold">50+</h1>
          <p className="text-gray-400 mt-4">Global Clients</p>
        </div>

        <div className="border border-white/10 p-10 rounded-3xl bg-white/[0.02]">
          <h1 className="text-6xl font-bold">20K+</h1>
          <p className="text-gray-400 mt-4">Products Exported</p>
        </div>

        <div className="border border-white/10 p-10 rounded-3xl bg-white/[0.02]">
          <h1 className="text-6xl font-bold">15+</h1>
          <p className="text-gray-400 mt-4">Countries</p>
        </div>

        <div className="border border-white/10 p-10 rounded-3xl bg-white/[0.02]">
          <h1 className="text-6xl font-bold">24/7</h1>
          <p className="text-gray-400 mt-4">Support</p>
        </div>

      </div>

    </section>

    {/* MANUFACTURING SECTION */}
    <section className="py-32 px-6">

      <div className="grid md:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">

        <div>

          <p className="uppercase tracking-[8px] text-gray-500 text-sm">
            OEM MANUFACTURING
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mt-6 leading-tight">
            Designed For <br />
            Performance
          </h1>

          <p className="text-gray-400 mt-8 leading-8 text-lg">
            Every product is manufactured with export-quality
            fabrics, precision stitching and modern performance-focused design.
          </p>

        </div>

        <div>

          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
            className="rounded-3xl"
          />

        </div>

      </div>

    </section>
{/* PARALLAX IMAGE SECTION */}
<section className="relative h-[800px] overflow-hidden">

  <img
    src="https://images.unsplash.com/photo-1523398002811-999ca8dec234"
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">

    <div className="text-center px-6">

      <p className="uppercase tracking-[8px] text-gray-400 text-sm">
        PERFORMANCE MEETS DESIGN
      </p>

      <h1 className="text-6xl md:text-8xl font-bold mt-8 leading-tight">
        MADE FOR <br />
        CHAMPIONS
      </h1>

    </div>

  </div>

</section>

{/* WHY CHOOSE US */}
<section className="py-40 px-6">

  <div className="text-center mb-24">

    <p className="uppercase tracking-[8px] text-gray-500 text-sm">
      WHY TS EXPORTS
    </p>

    <h1 className="text-5xl md:text-7xl font-bold mt-6">
      Global Manufacturing Excellence
    </h1>

  </div>

  <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

    <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02]">

      <h2 className="text-3xl font-bold">
        Premium Fabrics
      </h2>

      <p className="text-gray-400 mt-6 leading-8">
        Breathable, durable and performance-engineered materials
        for professional sportswear.
      </p>

    </div>

    <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02]">

      <h2 className="text-3xl font-bold">
        OEM & Private Label
      </h2>

      <p className="text-gray-400 mt-6 leading-8">
        Fully customized sportswear manufacturing for
        international brands and distributors.
      </p>

    </div>

    <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02]">

      <h2 className="text-3xl font-bold">
        Worldwide Delivery
      </h2>

      <p className="text-gray-400 mt-6 leading-8">
        Reliable global shipping with fast production
        timelines and export-quality standards.
      </p>

    </div>

  </div>

</section>

{/* SPLIT SECTION */}
<section className="py-40 px-6">

  <div className="grid md:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">

    <div>

      <img
        src="https://images.unsplash.com/photo-1514996937319-344454492b37"
        className="rounded-3xl h-[700px] object-cover"
      />

    </div>

    <div>

      <p className="uppercase tracking-[8px] text-gray-500 text-sm">
        CUSTOM SPORTSWEAR
      </p>

      <h1 className="text-5xl md:text-7xl font-bold mt-6 leading-tight">
        Crafted <br />
        With Precision
      </h1>

      <p className="text-gray-400 mt-8 text-lg leading-8">
        From football kits to gym apparel,
        every piece is built with precision,
        comfort and elite-level aesthetics.
      </p>

      <button
        onClick={() => setView("shop")}
        className="mt-10 border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition"
      >
        View Products
      </button>

    </div>

  </div>

</section>

{/* MANUFACTURING SERVICES */}
<section className="py-40 px-6 bg-zinc-950">

  <div className="text-center mb-24">

    <p className="uppercase tracking-[8px] text-gray-500 text-sm">
      SERVICES
    </p>

    <h1 className="text-5xl md:text-7xl font-bold mt-6">
      Manufacturing Services
    </h1>

  </div>

  <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">

    <div className="bg-white rounded-3xl overflow-hidden text-black">

      <img
        src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
        className="h-64 w-full object-cover"
      />

      <div className="p-8">
        <h2 className="text-2xl font-bold">
          OEM Manufacturing
        </h2>

        <p className="mt-4 text-gray-600 leading-7">
          Full-scale OEM production for global brands.
        </p>
      </div>

    </div>

    <div className="bg-white rounded-3xl overflow-hidden text-black">

      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
        className="h-64 w-full object-cover"
      />

      <div className="p-8">
        <h2 className="text-2xl font-bold">
          Custom Designs
        </h2>

        <p className="mt-4 text-gray-600 leading-7">
          Custom sublimation and private label solutions.
        </p>
      </div>

    </div>

    <div className="bg-white rounded-3xl overflow-hidden text-black">

      <img
        src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518"
        className="h-64 w-full object-cover"
      />

      <div className="p-8">
        <h2 className="text-2xl font-bold">
          Sampling
        </h2>

        <p className="mt-4 text-gray-600 leading-7">
          Fast prototype and sample development services.
        </p>
      </div>

    </div>

    <div className="bg-white rounded-3xl overflow-hidden text-black">

      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
        className="h-64 w-full object-cover"
      />

      <div className="p-8">
        <h2 className="text-2xl font-bold">
          Global Export
        </h2>

        <p className="mt-4 text-gray-600 leading-7">
          Worldwide logistics and export handling support.
        </p>
      </div>

    </div>

  </div>

</section>

{/* CLIENTS */}
<section className="py-24 px-6 bg-white text-black">

  <div className="text-center mb-20">

    <p className="uppercase tracking-[8px] text-gray-500 text-sm">
      TRUSTED BY
    </p>

    <h1 className="text-5xl font-bold mt-6">
      Global Partners
    </h1>

  </div>

  <div className="grid md:grid-cols-5 gap-10 items-center max-w-6xl mx-auto opacity-70">

    <h2 className="text-3xl font-bold text-center">
      FITZONE
    </h2>

    <h2 className="text-3xl font-bold text-center">
      ATHLEX
    </h2>

    <h2 className="text-3xl font-bold text-center">
      VELORA
    </h2>

    <h2 className="text-3xl font-bold text-center">
      SPORTIVA
    </h2>

    <h2 className="text-3xl font-bold text-center">
      FORCEWEAR
    </h2>

  </div>

</section>

{/* TESTIMONIALS */}
<section className="py-40 px-6 bg-white/[0.02]">

  <div className="text-center mb-24">

    <p className="uppercase tracking-[8px] text-gray-500 text-sm">
      CLIENTS
    </p>

    <h1 className="text-5xl md:text-7xl font-bold mt-6">
      Trusted Worldwide
    </h1>

  </div>

  <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

    <div className="border border-white/10 p-10 rounded-3xl">

      <p className="text-gray-300 leading-8">
        “Outstanding product quality and
        fast international delivery.”
      </p>

      <h3 className="mt-8 font-bold">
        — UK Distributor
      </h3>

    </div>

    <div className="border border-white/10 p-10 rounded-3xl">

      <p className="text-gray-300 leading-8">
        “Professional OEM manufacturing with
        premium stitching quality.”
      </p>

      <h3 className="mt-8 font-bold">
        — Germany Brand Owner
      </h3>

    </div>

    <div className="border border-white/10 p-10 rounded-3xl">

      <p className="text-gray-300 leading-8">
        “One of the best sportswear suppliers
        we’ve worked with.”
      </p>

      <h3 className="mt-8 font-bold">
        — UAE Importer
      </h3>

    </div>

  </div>

</section>
    {/* MANUFACTURING INFO */}
<section className="py-40 px-6 bg-white/[0.02]">

  <div className="text-center mb-24">

    <p className="uppercase tracking-[8px] text-gray-500 text-sm">
      MANUFACTURING DETAILS
    </p>

    <h1 className="text-5xl md:text-7xl font-bold mt-6">
      Export Process
    </h1>

  </div>

  <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">

    {/* MOQ */}
    <div className="border border-white/10 rounded-3xl p-10 bg-black">

      <h2 className="text-3xl font-bold">
        MOQ
      </h2>

      <h1 className="text-5xl font-bold mt-6">
        30 PCS
      </h1>

      <p className="text-gray-400 mt-6 leading-8">
        Flexible minimum order quantities
        for startups and brands.
      </p>

    </div>

    {/* SAMPLE */}
    <div className="border border-white/10 rounded-3xl p-10 bg-black">

      <h2 className="text-3xl font-bold">
        Samples
      </h2>

      <h1 className="text-5xl font-bold mt-6">
        5–7 Days
      </h1>

      <p className="text-gray-400 mt-6 leading-8">
        Fast sample production for testing
        quality and sizing.
      </p>

    </div>

    {/* PRODUCTION */}
    <div className="border border-white/10 rounded-3xl p-10 bg-black">

      <h2 className="text-3xl font-bold">
        Production
      </h2>

      <h1 className="text-5xl font-bold mt-6">
        2–4 Weeks
      </h1>

      <p className="text-gray-400 mt-6 leading-8">
        Efficient manufacturing timelines
        with export-quality standards.
      </p>

    </div>

    {/* SHIPPING */}
    <div className="border border-white/10 rounded-3xl p-10 bg-black">

      <h2 className="text-3xl font-bold">
        Shipping
      </h2>

      <h1 className="text-5xl font-bold mt-6">
        Worldwide
      </h1>

      <p className="text-gray-400 mt-6 leading-8">
        Global delivery with reliable
        export logistics support.
      </p>

    </div>

  </div>

</section>
    {/* FINAL CTA */}
    <section className="text-center py-40 px-6">

      <p className="uppercase tracking-[10px] text-gray-500 text-sm">
        FUTURE OF SPORTSWEAR
      </p>

      <h1 className="text-7xl md:text-9xl font-bold mt-8 leading-none">
        ELEVATE <br />
        YOUR BRAND
      </h1>

      <button
        onClick={() => setView("shop")}
        className="mt-12 bg-white text-black px-10 py-5 rounded-full text-xl hover:scale-105 transition"
      >
        Explore Products
      </button>

    </section>

  </div>

)}

      {/* ABOUT */}

      {view === "about" && (
  <div className="px-6 py-24 max-w-7xl mx-auto">

    {/* HERO ABOUT */}
    <div className="text-center mb-20">
      <h1 className="text-5xl md:text-7xl font-bold">
        About TS Exports
      </h1>

      <p className="text-gray-400 mt-6 max-w-3xl mx-auto leading-8">
        We are a Sialkot-based premium sportswear manufacturer specializing in
        high-performance apparel for global brands, clubs, and distributors.
      </p>
    </div>

    {/* STATS */}
    <div className="grid md:grid-cols-4 gap-6 mb-24">
      {aboutStats.map((s, i) => (
        <div
          key={i}
          className="border border-white/10 bg-white/[0.02] rounded-2xl p-8 text-center"
        >
          <h2 className="text-4xl font-bold">{s.value}</h2>
          <p className="text-gray-400 mt-3">{s.label}</p>
        </div>
      ))}
    </div>

    {/* STORY SECTION */}
    <div className="grid md:grid-cols-2 gap-16 items-center mb-32">

      <div>
        <h2 className="text-4xl font-bold mb-6">
          Who We Are
        </h2>

        <p className="text-gray-400 leading-8">
          TS Exports is built on precision manufacturing, export reliability,
          and long-term partnerships. We work with brands worldwide to produce
          custom sportswear with premium quality and consistent delivery.
        </p>

        <p className="text-gray-400 leading-8 mt-6">
          From concept to final production, we handle every step including
          fabric selection, sampling, bulk manufacturing, branding, and global shipping.
        </p>
      </div>

      <img
        src="https://images.unsplash.com/photo-1514996937319-344454492b37"
        className="rounded-3xl h-[500px] object-cover"
      />
    </div>

    {/* WHY CHOOSE US */}
    <div className="mb-32">

      <h2 className="text-5xl font-bold text-center mb-16">
        Why Choose Us
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {whyUs.map((item, i) => (
          <div
            key={i}
            className="border border-white/10 bg-white/[0.02] rounded-3xl p-10"
          >
            <h3 className="text-2xl font-bold">{item.title}</h3>
            <p className="text-gray-400 mt-4 leading-8">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* WHAT WE PROVIDE */}
    <div className="mb-32 text-center">

      <h2 className="text-5xl font-bold mb-12">
        What We Provide
      </h2>

      <div className="flex flex-wrap justify-center gap-4">
        {whatWeProvide.map((item, i) => (
          <span
            key={i}
            className="px-6 py-3 border border-white/10 rounded-full bg-white/[0.02] text-gray-300"
          >
            {item}
          </span>
        ))}
      </div>

    </div>

    {/* DIFFERENTIATION SECTION */}
    <div className="text-center">

      <h2 className="text-5xl font-bold mb-8">
        What Makes Us Different
      </h2>

      <p className="text-gray-400 max-w-3xl mx-auto leading-8">
        Unlike traditional manufacturers, we focus on brand building,
        consistent quality control, and scalable production systems.
        Our goal is not just to produce — but to help your brand grow globally.
      </p>

    </div>

  </div>
)}

      {/* SHOP */}

      {view === "shop" && (

  <div
    id="products-section"
    className="p-6"
  >
{selectedCategory && (
  <div className="mb-6 flex justify-between items-center">

    <h2 className="text-xl font-bold">
      Category: {selectedCategory}
    </h2>

    <button
      onClick={() => setSelectedCategory("")}
      className="border px-4 py-2 rounded-xl"
    >
      Clear Filter
    </button>

  </div>
)}
          {/* SEARCH */}

          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 mb-10 bg-white/10 border border-white/20 rounded-2xl"
          />

          {/* PRODUCTS */}

          <div className="grid md:grid-cols-3 gap-8">

            {filteredProducts.map((p: any) => (

              <div
                key={p.id}
                className="border border-white/10 rounded-3xl overflow-hidden bg-white/[0.02]"
              >

                {/* PRODUCT IMAGE */}

                <img
                  src={p.image}
                  className="w-full h-72 object-cover"
                />

                {/* PRODUCT INFO */}

                <div className="p-6">

                  <h2 className="text-2xl font-bold">
                    {p.name}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    {p.category}
                  </p>

                  <p className="mt-3">
                    MOQ: {p.moq}
                  </p>

                  <p className="text-3xl font-bold mt-4">
                    ${p.price}
                  </p>
<a
  href={`https://wa.me/923428145366?text=Hello, I want to inquire about: ${p.name}`}
  target="_blank"
  className="mt-4 block text-center bg-green-500 text-white py-3 rounded-xl"
>
  Contact on WhatsApp
</a>

<button
  onClick={async () => {
    await addDoc(collection(db, "inquiries"), {
      product: p.name,
      email: user?.email || "guest",
      time: new Date().toISOString()
    });

    alert("Inquiry sent successfully!");
  }}
  className="mt-4 w-full bg-white text-black py-3 rounded-xl"
>
  Request Quote
</button>
                  {/* DELETE BUTTON */}

                  {admin && (

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="mt-5 w-full border border-red-500 text-red-500 py-3 rounded-xl"
                    >
                      Delete Product
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* ADMIN */}

      {view === "admin" && (

        <div className="max-w-md mx-auto p-6 py-20">

          {!user ? (

            <>

              <h1 className="text-4xl font-bold mb-8">
                Admin Login
              </h1>

              <input
                placeholder="Email"
                className="w-full p-4 mb-4 bg-white/10 border border-white/20 rounded-2xl"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 mb-4 bg-white/10 border border-white/20 rounded-2xl"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                onClick={login}
                className="w-full bg-white text-black py-4 rounded-2xl"
              >
                Login
              </button>

              <button
                onClick={register}
                className="w-full border border-white/20 py-4 rounded-2xl mt-4"
              >
                Register
              </button>

            </>

          ) : admin ? (

            <>

              <h1 className="text-4xl font-bold mb-8">
                Admin Dashboard
              </h1>

              {/* PRODUCT NAME */}

              <input
                placeholder="Product Name"
                value={form.name}
                className="w-full p-4 mb-4 bg-white/10 border border-white/20 rounded-2xl"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              {/* PRICE */}

              <input
                placeholder="Price"
                value={form.price}
                className="w-full p-4 mb-4 bg-white/10 border border-white/20 rounded-2xl"
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />

              {/* CATEGORY */}

              <select
  value={form.category}
  className="w-full p-4 mb-4 bg-white/10 border border-white/20 rounded-2xl"
  onChange={(e) =>
    setForm({ ...form, category: e.target.value })
  }
>

  <option value="">Select Category</option>

  {categories.map((cat, i) => (

    <option
      key={i}
      value={cat.name}
      className="text-black"
    >
      {cat.name}
    </option>

  ))}

  <option value="Other" className="text-black">
    Other
  </option>

</select>

{form.category === "Other" && (

  <input
    placeholder="Custom Category"
    className="w-full p-4 mb-4 bg-white/10 border border-white/20 rounded-2xl"
    onChange={(e) =>
      setForm({
        ...form,
        category: e.target.value
      })
    }
  />

)}

              {/* IMAGE URL */}

              <input
                placeholder="Image URL"
                value={form.image}
                className="w-full p-4 mb-4 bg-white/10 border border-white/20 rounded-2xl"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
              />

              {/* MOQ */}

              <input
                placeholder="MOQ"
                value={form.moq}
                className="w-full p-4 mb-6 bg-white/10 border border-white/20 rounded-2xl"
                onChange={(e) =>
                  setForm({ ...form, moq: e.target.value })
                }
              />

              {/* ADD PRODUCT */}

              <button
                onClick={addProduct}
                className="w-full bg-white text-black py-4 rounded-2xl"
              >
                Add Product
              </button>

              {/* LOGOUT */}

              <button
                onClick={logout}
                className="w-full mt-4 border border-red-500 text-red-500 py-4 rounded-2xl"
              >
                Logout
              </button>

            </>

          ) : (

            <div>

              <p className="text-red-400 mb-4">
                You are not admin.
              </p>

              <button
                onClick={logout}
                className="w-full border border-red-500 text-red-500 py-4 rounded-2xl"
              >
                Logout
              </button>

            </div>

          )}

        </div>

      )}

           {view === "contact" && (
  <div className="max-w-7xl mx-auto px-6 py-24">

    {/* HEADER */}
    <div className="text-center mb-20">
      <h1 className="text-5xl md:text-7xl font-bold">
        Contact Us
      </h1>
      <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
        Get in touch with TS Exports for custom sportswear manufacturing,
        bulk orders, OEM production, and global distribution.
      </p>
    </div>

    {/* GRID */}
    <div className="grid md:grid-cols-2 gap-16">

      {/* LEFT - CONTACT INFO */}
      <div className="space-y-8">

        <div className="border border-white/10 p-8 rounded-3xl bg-white/[0.02]">
          <h2 className="text-2xl font-bold">Location</h2>
          <p className="text-gray-400 mt-3">Sialkot, Pakistan</p>
        </div>

        <div className="border border-white/10 p-8 rounded-3xl bg-white/[0.02]">
          <h2 className="text-2xl font-bold">Email</h2>
          <p className="text-gray-400 mt-3">info@tsexports.com</p>
        </div>

        <div className="border border-white/10 p-8 rounded-3xl bg-white/[0.02]">
          <h2 className="text-2xl font-bold">WhatsApp</h2>
          <p className="text-gray-400 mt-3">
            +92 342 8145366
          </p>

          <a
            href="https://wa.me/923428145366"
            target="_blank"
            className="inline-block mt-4 bg-green-500 text-white px-6 py-3 rounded-xl"
          >
            Chat on WhatsApp
          </a>
        </div>

      </div>

      {/* RIGHT - FORM */}
      <div className="border border-white/10 p-10 rounded-3xl bg-white/[0.02]">

        <h2 className="text-3xl font-bold mb-6">
          Send Inquiry
        </h2>

        <input
  placeholder="Your Name"
  value={contactForm.name}
  onChange={(e) =>
    setContactForm({
      ...contactForm,
      name: e.target.value
    })
  }
  className="w-full p-4 mb-4 bg-white/10 rounded-xl"
/>

        <input
  placeholder="Your Email"
  value={contactForm.email}
  onChange={(e) =>
    setContactForm({
      ...contactForm,
      email: e.target.value
    })
  }
  className="w-full p-4 mb-4 bg-white/10 rounded-xl"
/>

     <input
  placeholder="Company Name"
  value={contactForm.company}
  onChange={(e) =>
    setContactForm({
      ...contactForm,
      company: e.target.value
    })
  }
  className="w-full p-4 mb-4 bg-white/10 rounded-xl"
/>

       <textarea
  placeholder="Your Message"
  value={contactForm.message}
  onChange={(e) =>
    setContactForm({
      ...contactForm,
      message: e.target.value
    })
  }
  className="w-full p-4 mb-6 bg-white/10 rounded-xl h-40"
/>

      <button
  onClick={sendContactInquiry}
  className="w-full bg-white text-black py-4 rounded-xl font-bold"
>
  Send Message
</button>

        <p className="text-gray-500 text-sm mt-4">
          We usually respond within 24 hours.
        </p>

      </div>

    </div>

    {/* BOTTOM CTA */}
    <div className="text-center mt-24">
      <h2 className="text-4xl font-bold">
        Let’s Build Your Brand Together
      </h2>
      <p className="text-gray-400 mt-4">
        OEM manufacturing • Private label • Bulk export
      </p>
      

    </div>

  </div>
  
)}

{/* BLOGS PAGE */}
{view === "blogs" && !selectedBlog && (

  <div className="bg-[#f5f5f5] text-black min-h-screen">

    {/* HERO */}
    <section className="py-32 px-6 text-center">

      <p className="uppercase tracking-[8px] text-gray-500 text-sm">
        TS EXPORTS BLOGS
      </p>

      <h1 className="text-6xl md:text-8xl font-bold mt-6">
        Manufacturing <br />
        Insights
      </h1>

      <p className="max-w-3xl mx-auto mt-8 text-gray-600 leading-8 text-lg">
        Explore sportswear manufacturing,
        OEM production, branding and export industry insights.
      </p>

    </section>

    {/* BLOG GRID */}
    <section className="max-w-7xl mx-auto px-6 pb-32">

      <div className="grid md:grid-cols-2 gap-10">

        {blogs.map((blog) => (

          <div
            key={blog.id}
            onClick={() => setSelectedBlog(blog)}
            className="bg-white rounded-[40px] overflow-hidden shadow-xl cursor-pointer hover:-translate-y-2 transition duration-500"
          >

            <img
              src={blog.image}
              className="w-full h-[320px] object-cover"
            />

            <div className="p-10">

              <p className="uppercase tracking-[5px] text-gray-500 text-sm">
                {blog.category}
              </p>

              <h2 className="text-4xl font-bold mt-5 leading-tight">
                {blog.title}
              </h2>

              <button className="mt-8 border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition">

                Read Article

              </button>

            </div>

          </div>

        ))}

      </div>

    </section>

  </div>

)}

{/* SINGLE BLOG PAGE */}
{selectedBlog && (

  <div className="bg-white text-black min-h-screen">

    {/* HERO IMAGE */}
    <section className="relative h-[700px]">

      <img
        src={selectedBlog.image}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">

        <div className="text-center px-6 text-white max-w-5xl">

          <p className="uppercase tracking-[8px] text-gray-300 text-sm">
            {selectedBlog.category}
          </p>

          <h1 className="text-5xl md:text-8xl font-bold mt-8 leading-tight">
            {selectedBlog.title}
          </h1>

        </div>

      </div>

    </section>

    {/* CONTENT */}
    <section className="max-w-5xl mx-auto px-6 py-32">

      <p className="text-2xl leading-[55px] text-gray-700">
        {selectedBlog.content}
      </p>

      {/* EXTRA CONTENT */}
      <div className="mt-20 grid md:grid-cols-2 gap-10">

        <div className="bg-[#f5f5f5] p-10 rounded-[35px]">

          <h2 className="text-3xl font-bold mb-6">
            Manufacturing Expertise
          </h2>

          <p className="text-gray-600 leading-8">
            TS Exports uses premium fabrics,
            advanced stitching systems and
            export-quality production methods
            trusted by global clients.
          </p>

        </div>

        <div className="bg-[#f5f5f5] p-10 rounded-[35px]">

          <h2 className="text-3xl font-bold mb-6">
            Global Export Standards
          </h2>

          <p className="text-gray-600 leading-8">
            Every product passes quality checks,
            sizing inspection and export packaging
            before worldwide shipment dispatch.
          </p>

        </div>

      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => setSelectedBlog(null)}
        className="mt-20 bg-black text-white px-10 py-5 rounded-full"
      >

        Back To Blogs

      </button>

    </section>

  </div>

)}

{/* ================= PRIVACY POLICY ================= */}
{view === "privacy" && (

  <div className="bg-black text-white">

    {/* HERO */}
    <section className="relative py-40 px-6 text-center overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto">

        <p className="uppercase tracking-[10px] text-gray-500 text-sm">
          TS EXPORTS
        </p>

        <h1 className="text-6xl md:text-8xl font-bold mt-8 leading-tight">
          Privacy <br />
          Policy
        </h1>

        <p className="text-gray-400 max-w-3xl mx-auto mt-10 leading-8 text-lg">
          TS Exports values transparency, privacy and data protection.
          This policy explains how information is collected, used and protected.
        </p>

      </div>

    </section>

    {/* CONTENT */}
    <section className="max-w-6xl mx-auto px-6 pb-32">

      <div className="grid md:grid-cols-2 gap-10">

        <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02]">
          <h2 className="text-3xl font-bold mb-6">
            Information We Collect
          </h2>

          <p className="text-gray-400 leading-8">
            We may collect customer names, email addresses,
            phone numbers, shipping information, inquiry details
            and order-related information for communication,
            production and delivery purposes.
          </p>
        </div>

        <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02]">
          <h2 className="text-3xl font-bold mb-6">
            Usage Of Information
          </h2>

          <p className="text-gray-400 leading-8">
            Information is used to process orders,
            improve customer experience, provide support,
            handle production updates and maintain
            long-term business relationships.
          </p>
        </div>

        <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02]">
          <h2 className="text-3xl font-bold mb-6">
            Security Protection
          </h2>

          <p className="text-gray-400 leading-8">
            TS Exports implements secure systems
            and restricted access procedures to
            protect customer information from
            unauthorized access or misuse.
          </p>
        </div>

        <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02]">
          <h2 className="text-3xl font-bold mb-6">
            Third Party Services
          </h2>

          <p className="text-gray-400 leading-8">
            Trusted third-party logistics, payment
            and analytics services may process limited
            information strictly required for business operations.
          </p>
        </div>

      </div>

      {/* LARGE SECTION */}
      <div className="mt-20 border border-white/10 rounded-3xl p-14 bg-white/[0.02]">

        <h2 className="text-5xl font-bold mb-10">
          Data Transparency
        </h2>

        <p className="text-gray-400 leading-9 text-lg">
          We are committed to responsible data handling practices.
          Customer information is never sold or distributed for
          unauthorized marketing purposes. We continuously improve
          our digital infrastructure to ensure secure communication,
          safe inquiry handling and protected business transactions.
        </p>

      </div>

    </section>

  </div>

)}

{/* ================= TERMS ================= */}
{view === "terms" && (

  <div className="bg-black text-white">

    {/* HERO */}
    <section className="py-40 px-6 text-center">

      <p className="uppercase tracking-[10px] text-gray-500 text-sm">
        TS EXPORTS
      </p>

      <h1 className="text-6xl md:text-8xl font-bold mt-8">
        Terms & <br />
        Conditions
      </h1>

      <p className="text-gray-400 max-w-3xl mx-auto mt-10 leading-8 text-lg">
        These terms define the conditions regarding manufacturing,
        orders, payments, shipping and customer responsibilities.
      </p>

    </section>

    {/* CONTENT */}
    <section className="max-w-6xl mx-auto px-6 pb-32">

      <div className="space-y-10">

        <div className="border border-white/10 rounded-3xl p-12 bg-white/[0.02]">

          <h2 className="text-4xl font-bold mb-6">
            Orders & Confirmation
          </h2>

          <p className="text-gray-400 leading-9 text-lg">
            All orders are subject to design approval,
            payment verification and production scheduling.
            Production begins only after final confirmation
            from both parties.
          </p>

        </div>

        <div className="border border-white/10 rounded-3xl p-12 bg-white/[0.02]">

          <h2 className="text-4xl font-bold mb-6">
            Manufacturing Process
          </h2>

          <p className="text-gray-400 leading-9 text-lg">
            Production timelines may vary depending on
            customization, fabric sourcing, seasonal demand
            and order quantities. TS Exports maintains
            export-grade quality control standards during production.
          </p>

        </div>

        <div className="border border-white/10 rounded-3xl p-12 bg-white/[0.02]">

          <h2 className="text-4xl font-bold mb-6">
            Payments
          </h2>

          <p className="text-gray-400 leading-9 text-lg">
            Customers are required to complete agreed
            payment terms before shipment dispatch.
            Delayed payments may affect production
            and delivery timelines.
          </p>

        </div>

        <div className="border border-white/10 rounded-3xl p-12 bg-white/[0.02]">

          <h2 className="text-4xl font-bold mb-6">
            Intellectual Property
          </h2>

          <p className="text-gray-400 leading-9 text-lg">
            Customer logos, artwork and branding
            remain the intellectual property of their respective owners.
            TS Exports uses provided assets strictly for manufacturing purposes.
          </p>

        </div>

      </div>

    </section>

  </div>

)}

{/* ================= SHIPPING POLICY ================= */}
{view === "shipping" && (

  <div className="bg-black text-white">

    {/* HERO */}
    <section className="py-40 px-6 text-center">

      <p className="uppercase tracking-[10px] text-gray-500 text-sm">
        GLOBAL EXPORT LOGISTICS
      </p>

      <h1 className="text-6xl md:text-8xl font-bold mt-8">
        Shipping <br />
        Policy
      </h1>

      <p className="text-gray-400 max-w-3xl mx-auto mt-10 leading-8 text-lg">
        Fast, reliable and secure worldwide shipping
        for samples, bulk orders and OEM manufacturing projects.
      </p>

    </section>

    {/* CARDS */}
    <section className="max-w-7xl mx-auto px-6 pb-32">

      <div className="grid md:grid-cols-3 gap-8">

        <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02]">

          <h2 className="text-3xl font-bold mb-6">
            Sample Orders
          </h2>

          <p className="text-gray-400 leading-8">
            Sample development generally requires
            5–7 business days depending on
            customization requirements.
          </p>

        </div>

        <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02]">

          <h2 className="text-3xl font-bold mb-6">
            Bulk Production
          </h2>

          <p className="text-gray-400 leading-8">
            Bulk manufacturing timelines typically
            range between 2–4 weeks depending
            on order volume and fabric sourcing.
          </p>

        </div>

        <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02]">

          <h2 className="text-3xl font-bold mb-6">
            Worldwide Delivery
          </h2>

          <p className="text-gray-400 leading-8">
            TS Exports ships globally using trusted
            logistics partners and export handling services.
          </p>

        </div>

      </div>

      {/* BIG SECTION */}
      <div className="mt-20 border border-white/10 rounded-3xl p-14 bg-white/[0.02]">

        <h2 className="text-5xl font-bold mb-10">
          Export Logistics Support
        </h2>

        <p className="text-gray-400 leading-9 text-lg">
          Our team provides complete export assistance including
          shipment coordination, invoice handling, tracking support,
          packaging standards and international dispatch management.
          Customers receive shipment tracking details after dispatch
          for transparent global delivery operations.
        </p>

      </div>

    </section>

  </div>

)}

{/* BLOG SECTION */}
<section className="py-40 px-6 bg-stone-100 text-black">

  <div className="text-center mb-24">

    <p className="uppercase tracking-[8px] text-gray-500 text-sm">
      INSIGHTS
    </p>

    <h1 className="text-5xl md:text-7xl font-bold mt-6">
      Latest Articles
    </h1>

  </div>

  <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">

    <div className="bg-white rounded-3xl overflow-hidden shadow-xl">

      <img
        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
        className="h-72 w-full object-cover"
      />

      <div className="p-8">

        <p className="text-gray-500 text-sm">
          Manufacturing
        </p>

        <h2 className="text-3xl font-bold mt-4">
          How Premium Sportswear Is Manufactured
        </h2>

      </div>

    </div>

    <div className="bg-white rounded-3xl overflow-hidden shadow-xl">

      <img
        src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
        className="h-72 w-full object-cover"
      />

      <div className="p-8">

        <p className="text-gray-500 text-sm">
          Branding
        </p>

        <h2 className="text-3xl font-bold mt-4">
          Building A Global Sportswear Brand
        </h2>

      </div>

    </div>

    <div className="bg-white rounded-3xl overflow-hidden shadow-xl">

      <img
        src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb"
        className="h-72 w-full object-cover"
      />

      <div className="p-8">

        <p className="text-gray-500 text-sm">
          Export
        </p>

        <h2 className="text-3xl font-bold mt-4">
          Why Sialkot Leads Sportswear Exports
        </h2>

      </div>

    </div>

  </div>

</section>

      {/* ULTRA PREMIUM FOOTER */}
<footer className="relative border-t border-black/10 bg-white text-black overflow-hidden">

  {/* BACKGROUND TEXT */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

    <h1 className="text-[120px] md:text-[240px] font-bold text-white/[0.03] leading-none select-none">
      TS EXPORTS
    </h1>

  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">

    {/* TOP AREA */}

    <div className="grid md:grid-cols-4 gap-16">

      {/* BRAND */}
      <div>

        <h1 className="text-3xl font-bold tracking-[6px]">
          TS EXPORTS
        </h1>

        <p className="text-gray-500 mt-8 leading-8">
          Premium sportswear manufacturer from Sialkot
          producing export-quality apparel for brands,
          teams and distributors worldwide.
        </p>

        {/* SOCIALS */}
        <div className="flex gap-4 mt-8">

       <a
  href="https://instagram.com/ri.zwana6887"
  target="_blank"
  className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-white hover:text-black transition"
>
  IG
</a>

        <a
  href="https://facebook.com/Rizwana Javed"
  target="_blank"
  className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-white hover:text-black transition"
>
  FB
</a>

         <a
  href="https://wa.me/923428145366"
  target="_blank"
  className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-white hover:text-black transition"
>
  WA
</a>

        </div>

      </div>

      {/* QUICK LINKS */}
      <div>

        <h2 className="text-xl font-semibold mb-8">
          Quick Links
        </h2>

        <div className="space-y-5 text-gray-500">

          <button
            onClick={() => setView("home")}
            className="block hover:text-white transition"
          >
            Home
          </button>

          <button
  onClick={() => setView("about")}
  className="block hover:text-white transition"
>
  About Us
</button>

<button
  onClick={() => setView("contact")}
  className="block hover:text-white transition"
>
  Contact Us
</button>

<button
  onClick={() => setView("blogs")}
  className="block hover:text-white transition"
>
  Blogs
</button>

        </div>

      </div>

 {/* PRODUCT CATEGORIES */}
<div>

  <h2 className="text-xl font-semibold mb-8">
    Categories
  </h2>

  <div className="space-y-5 text-gray-500">

    {categories.map((cat, i) => (

      <button
        key={i}
        onClick={() => {

          setSelectedCategory(cat.name);

          setView("shop");

          // SCROLL TO PRODUCTS TOP
          setTimeout(() => {

            const section =
              document.getElementById("products-section");

            section?.scrollIntoView({
              behavior: "smooth"
            });

          }, 100);

        }}
        className="block hover:text-white transition"
      >
        {cat.name}
      </button>

    ))}

  </div>

</div>

      {/* CONTACT */}
      <div>

        <h2 className="text-xl font-semibold mb-8">
          Contact
        </h2>

        <div className="space-y-6 text-gray-500 leading-7">

          <div>
            <p className="text-white font-medium mb-1">
              Location
            </p>

            <p>Sialkot, Pakistan</p>
          </div>

          <div>
            <p className="text-white font-medium mb-1">
              Email
            </p>

            <p>info@tsexports.com</p>
          </div>

          <div>
            <p className="text-white font-medium mb-1">
              Phone
            </p>

            <p>+92 3426889767 </p>
          </div>

        </div>

        {/* BUTTON */}
<button
  onClick={() => setView("contact")}
  className="mt-10 border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition"
>

  Contact Now

</button>

      </div>

    </div>

    {/* NEWSLETTER */}
    <div className="mt-32 border-t border-black/10 pt-16">

      <div className="grid md:grid-cols-2 gap-10 items-center">

        <div>

          <p className="uppercase tracking-[8px] text-gray-600 text-sm">
            STAY UPDATED
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Subscribe For Updates
          </h2>

        </div>

      <div className="flex gap-4">

  <input
    placeholder="Enter your email"
    value={subscriberEmail}
    onChange={(e) => setSubscriberEmail(e.target.value)}
    className="flex-1 bg-white/5 border border-black/10 px-6 py-4 rounded-full outline-none"
  />

  <button
    onClick={async () => {

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!subscriberEmail || !emailRegex.test(subscriberEmail)) {

  alert("Unsuccessful subscription. Please enter a valid email address.");

  return;
}

      try {

        await addDoc(collection(db, "subscribers"), {
          email: subscriberEmail,
          time: new Date().toISOString()
        });

        alert("Subscribed successfully!");

        setSubscriberEmail("");

      } catch (err) {

        alert("Something went wrong");

      }

    }}
    className="bg-white text-black px-8 rounded-full hover:scale-105 transition"
  >

    Subscribe

  </button>

</div>

      </div>

    </div>

    {/* BOTTOM */}
    <div className="mt-20 pt-10 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">

      <p>
        © 2026 TS Exports. All rights reserved.
      </p>

      <div className="flex gap-8">

       <button
  onClick={() => setView("privacy")}
  className="hover:text-white transition"
>
  Privacy Policy
</button>

<button
  onClick={() => setView("terms")}
  className="hover:text-white transition"
>
  Terms & Conditions
</button>

<button
  onClick={() => setView("shipping")}
  className="hover:text-white transition"
>
  Shipping Policy
</button>

      </div>

    </div>

  </div>

</footer>

</div>
);
}