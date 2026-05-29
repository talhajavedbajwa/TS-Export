"use client";


import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  /* ---------------- PREMIUM CURSOR ---------------- */

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });

  useEffect(() => {

    const moveCursor = (e: MouseEvent) => {

      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });

    };

    window.addEventListener("mousemove", moveCursor);

    return () =>
      window.removeEventListener(
        "mousemove",
        moveCursor
      );

  }, []);

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
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop",
      content:
        "TS Exports follows a complete premium manufacturing workflow including fabric sourcing, cutting, sublimation printing, stitching, quality inspection and export packaging. Every product is developed with export-quality standards to ensure durability, comfort and elite performance."
    },

    {
      id: 2,
      title: "OEM & Private Label Production Explained",
      category: "OEM Services",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
      content:
        "OEM manufacturing allows global brands to build custom sportswear under their own brand identity. TS Exports provides logo printing, labels, packaging, custom designs and full-scale private label production for startups and established companies."
    },

    {
      id: 3,
      title: "Why Sialkot Leads The Sportswear Industry",
      category: "Industry",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
      content:
        "Sialkot is globally recognized for sports manufacturing excellence. The city produces world-class sportswear, footballs and athletic apparel for international brands due to its skilled workforce, manufacturing expertise and export infrastructure."
    },

    {
      id: 4,
      title: "How To Start Your Own Sportswear Brand",
      category: "Branding",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
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
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop"
    },

    {
      title: "PERFORMANCE MEETS LUXURY",
      subtitle:
        "Elite fabrics, precision stitching and premium athletic apparel for modern brands.",
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop"
    },

    {
      title: "OEM & PRIVATE LABEL",
      subtitle:
        "Custom manufacturing solutions for clubs, startups and global sportswear companies.",
      image:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop"
    }

  ];

  /* ---------------- FILTER ---------------- */
  // CATEGORY BLOCKS DATA (WEZIO STYLE)
  const categories = [

    {
      name: "Football Uniforms",
      img: "https://ajeerindustries.com/wp-content/uploads/2025/12/soccer-jersey-shorts-manufacturer.webp?q=80&w=1600&auto=format&fit=crop"
    },

    {
      name: "Gym Wear",
      img: "https://icdn.tradew.com/file/202012/1574750/jpg/8335618.jpg?q=80&w=1600&auto=format&fit=crop"
    },

    {
      name: "Cricket Uniforms",
      img: "https://www.drhsports.com/uploaded_files/category_images/Cricket-Trousers21_03_2024_12_15_15.jpg?q=80&w=1600&auto=format&fit=crop"
    },

    {
      name: "Tracksuits",
      img: "https://5.imimg.com/data5/SELLER/Default/2024/8/445681821/BI/RE/NF/73260699/hyflash-aala04583-500x500.jpg?q=80&w=1600&auto=format&fit=crop"
    },

    {
      name: "Hoodies",
      img: "https://argusapparel.com/wp-content/uploads/2024/01/newhoodie4_2000x.jpg?q=80&w=1600&auto=format&fit=crop"
    },

    {
      name: "Compression Wear",
      img: "https://thygesenapparel.com/wp-content/uploads/2023/081/compression-shirts-manufacturing-supportive-sportswear.webp"
    },

    {
      name: "Training Wear",
      img: "https://cheezclothing.com/wp-content/uploads/2024/06/Men-Tank-Top-Casual-Sleeveless-Tops-Quick-Dry-Tank-T-Shirt-Vest-Top-For-Gym_ce61a97e-2dff-45c0-95f0-106b8125b0aa.22860232022cf00cd11d623dc89e9bf9.webp?q=80&w=1600&auto=format&fit=crop"
    },

    {
      name: "Basketball Uniforms",
      img: "https://www.alanicglobal.com/wp-content/uploads/2026/05/lightweight-basketball-uniforms.jpg?q=80&w=1600&auto=format&fit=crop"
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

    <div className="
     min-h-screen
    bg-[#050505]
    text-white
    overflow-x-hidden
    selection:bg-white
    selection:text-black
    antialiased
    cursor-none
    " >

      {/* PREMIUM CURSOR */}

      <motion.div
        animate={{
          x: mousePosition.x - 10,
          y: mousePosition.y - 10
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28
        }}
        className="
  fixed
  top-0
  left-0
  w-5
  h-5
  rounded-full
  bg-white
  z-[9999]
  pointer-events-none
  mix-blend-difference
  "
      />

      <motion.div
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        className="
  fixed
  top-0
  left-0
  w-12
  h-12
  rounded-full
  border
  border-white/30
  z-[9998]
  pointer-events-none
  "
      />

      {/* NAVBAR */}

      <div className="
fixed top-0 left-0 w-full z-50
flex justify-between items-center
px-10 py-4
backdrop-blur-xl
bg-black/20
border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]
transition-all duration-500
">

        <h1 className="font-bold text-2xl tracking-wide">
          TS EXPORTS
        </h1>

        <div className="flex gap-12 text-[13px] uppercase tracking-[4px] font-light items-center">

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
              className="
    flex items-center gap-2
    hover:text-gray-300
    transition
    "
            >
              Products

              {/* LUXURY ARROW */}
              <svg
                className="
      w-4 h-4
      transition duration-300
      group-hover:rotate-180
      "
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

            {/* DROPDOWN */}
            <div className="absolute top-full left-0 mt-6 w-80 backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl opacity-0 invisible translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-500 z-50 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)]">

              {/* ALL PRODUCTS */}
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setView("shop");
                }}
                className="
  w-full text-left
  px-6 py-4
  border-b border-white/10
  hover:bg-white/10
  transition
  uppercase tracking-[2px]
  text-sm
  "
              >
                All Products
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
                  className="
w-full text-left
px-6 py-4
hover:bg-white/10
transition
uppercase tracking-[2px]
text-sm
"
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

        <div className="overflow-x-hidden">

          {/* LUXURY HERO SLIDER */}
          <section
            className="
relative
min-h-screen
overflow-hidden
px-6
pt-32
md:pt-40
"
          >

            {/* SLIDES */}
            {heroSlides.map((slide, index) => (

              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${currentSlide === index
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                  }`}
              >

                {/* IMAGE */}
                <img
                  src={slide.image}
                  loading="lazy"
                  className="w-full h-full object-cover animate-[pulse_8s_ease-in-out_infinite]"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/65" />

                {/* CONTENT */}
                <div
                  className="
absolute
inset-0
flex
items-center
justify-center
text-center
px-6
pt-20
md:pt-28
"
                >

                  <div className="max-w-4xl">

                    <p className="uppercase tracking-[10px] text-gray-400 text-sm mb-6">
                      TS EXPORTS
                    </p>

                    <h1
                      className="
text-[26px]
sm:text-[42px]
md:text-[72px]
lg:text-[92px]
font-bold
leading-[1]
tracking-[-1px]
uppercase
max-w-4xl
mx-auto
"
                    >

                      {slide.title}

                    </h1>

                    <p
                      className="
text-gray-300
text-base
md:text-xl
leading-8
mt-6
max-w-2xl
mx-auto
font-light
px-2
"
                    >

                      {slide.subtitle}

                    </p>

                    <button
                      onClick={() => setView("shop")}
                      className="
mt-10
border border-white
bg-white
text-black
px-8 py-4
uppercase tracking-[3px]
text-xs md:text-sm
hover:bg-transparent
hover:text-white
transition-all duration-500
hover:scale-105
"
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
                  className={`w-3 h-3 rounded-full transition ${currentSlide === index
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
                    loading="lazy"
                    className="w-full h-full rounded-[40px] object-cover group-hover:scale-110 transition-all duration-1000 ease-out transform-gpu will-change-transform group-hover:scale-110
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black /90 via-black/30 to-transparent" />

                  <div className="group absolute bottom-8 left-8">
                    <h2 className="text-3xl font-black tracking-tight group-hover:translate-x-2 transition duration-500">
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

          <div className="max-w-7xl mx-auto border-t border-white/5" />
          {/* STATS */}
          <section className="py-32 px-6">

            <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto text-center">

              <div className="
group
border border-white/10
p-10
rounded-[40px]
bg-white/[0.03]
backdrop-blur-xl
hover:bg-white/[0.06]
hover:-translate-y-5
hover:scale-[1.02]
hover:border-white/20
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
relative
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">
                <h1 className="
text-6xl md:text-7xl
font-black
tracking-tight
bg-gradient-to-r from-white to-gray-500
bg-clip-text text-transparent
">50+</h1>
                <p className="text-gray-400 mt-4">Global Clients</p>
              </div>
              <div className="
group
border border-white/10
p-10
rounded-[40px]
bg-white/[0.03]
backdrop-blur-xl
hover:bg-white/[0.06]
hover:-translate-y-5
hover:scale-[1.02]
hover:border-white/20
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
relative
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">
                <h1 className="
text-6xl md:text-7xl
font-black
tracking-tight
bg-gradient-to-r from-white to-gray-500
bg-clip-text text-transparent
">20K+</h1>
                <p className="text-gray-400 mt-4">Products Exported</p>
              </div>

              <div className="
group
border border-white/10
p-10
rounded-[40px]
bg-white/[0.03]
backdrop-blur-xl
hover:bg-white/[0.06]
hover:-translate-y-5
hover:scale-[1.02]
hover:border-white/20
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
relative
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">
                <h1 className="
text-6xl md:text-7xl
font-black
tracking-tight
bg-gradient-to-r from-white to-gray-500
bg-clip-text text-transparent
">15+</h1>
                <p className="text-gray-400 mt-4">Countries</p>
              </div>

              <div className="
group
border border-white/10
p-10
rounded-[40px]
bg-white/[0.03]
backdrop-blur-xl
hover:bg-white/[0.06]
hover:-translate-y-5
hover:scale-[1.02]
hover:border-white/20
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
relative
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">
                <h1 className="
text-6xl md:text-7xl
font-black
tracking-tight
bg-gradient-to-r from-white to-gray-500
bg-clip-text text-transparent
">24/7</h1>
                <p className="text-gray-400 mt-4">Support</p>
              </div>

            </div>

          </section>

          <div className="max-w-7xl mx-auto border-t border-white/5" />

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

              <div className="group relative overflow-hidden rounded-[40px]">

                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop"
                  loading="lazy"
                  className="w-full h-full rounded-[40px] object-cover group-hover:scale-110 transition-all duration-1000 ease-out transform-gpu will-change-transform group-hover:scale-110
          
          />

        </div>

      </div>

    </section>


{/* PARALLAX IMAGE SECTION */}
<section className="
                  group relative h-screen
                  overflow-hidden
">
                <div className="absolute inset-0 overflow-hidden"></div>

                <img
                  src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop"
                  loading="lazy"
                  className="
  w-full
  h-full
  rounded-[40px]
  object-cover
  group-hover:scale-110
  transition-all duration-700 ease-out
  transform-gpu
  will-change-transform
  "
                />

                <div className="
absolute inset-0
bg-black/75
backdrop-blur-sm
flex items-center justify-center
">

                  <div className="text-center px-6">

                    <p className="uppercase tracking-[8px] text-gray-400 text-sm">
                      PERFORMANCE MEETS DESIGN
                    </p>

                    <h1 className="
text-[70px]
md:text-[180px]
text-white
font-black
leading-none
tracking-tight
uppercase hover:text-white
transition
duration-500
">
                      MADE FOR <br />
                      CHAMPIONS
                    </h1>

                  </div>

                </div>

              </section>

              <div className="max-w-7xl mx-auto border-t border-white/5" />

              {/* WHY CHOOSE US */}
              <section className="py-40 px-6 relative overflow-hidden">

                <div className="text-center mb-24">

                  <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                    WHY TS EXPORTS
                  </p>

                  <h1 className="
text-5xl
md:text-7xl
font-bold
mt-6
leading-tight
tracking-tight
hover:text-white
transition
duration-500
">
                    Global Manufacturing Excellence
                  </h1>

                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

                  <div className="
group
relative
overflow-hidden
border border-white/10
rounded-[35px]
p-12
bg-gradient-to-br from-white/[0.04] to-transparent
backdrop-blur-xl
hover:border-cyan-400/40
hover:-translate-y-5
transition-all duration-700
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">

                    <h2 className="text-3xl font-black tracking-tight group-hover:translate-x-2 transition duration-500">
                      Premium Fabrics
                    </h2>

                    <p className="text-gray-400 mt-6 leading-8">
                      Breathable, durable and performance-engineered materials
                      for professional sportswear.
                    </p>

                  </div>

                  <div className="
group
relative
overflow-hidden
border border-white/10
rounded-[35px]
p-12
bg-gradient-to-br from-white/[0.04] to-transparent
backdrop-blur-xl
hover:border-cyan-400/40
hover:-translate-y-5
transition-all duration-700
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">

                    <h2 className="text-3xl font-black tracking-tight group-hover:translate-x-2 transition duration-500">
                      OEM & Private Label
                    </h2>

                    <p className="text-gray-400 mt-6 leading-8">
                      Fully customized sportswear manufacturing for
                      international brands and distributors.
                    </p>

                  </div>

                  <div className="
group
relative
overflow-hidden
border border-white/10
rounded-[35px]
p-12
bg-gradient-to-br from-white/[0.04] to-transparent
backdrop-blur-xl
hover:border-cyan-400/40
hover:-translate-y-5
transition-all duration-700
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">

                    <h2 className="text-3xl font-black tracking-tight group-hover:translate-x-2 transition duration-500">
                      Worldwide Delivery
                    </h2>

                    <p className="text-gray-400 mt-6 leading-8">
                      Reliable global shipping with fast production
                      timelines and export-quality standards.
                    </p>

                  </div>

                </div>

              </section>

              <div className="max-w-7xl mx-auto border-t border-white/5" />
              <div className="
absolute
w-[500px]
h-[500px]
bg-cyan-500/10
blur-[140px]
rounded-full
top-0
left-1/2
-translate-x-1/2
pointer-events-none
" />

              {/* APPLE STYLE TYPOGRAPHY SECTION */}
              <section className="relative py-72 px-6 text-center max-w-7xl mx-auto">

                <p className="uppercase tracking-[10px] text-gray-500 text-sm">
                  TS EXPORTS
                </p>

                <h1 className="
  text-7xl
  md:text-[180px]
  tracking-[-6px]
  font-black
  leading-none
  tracking-tight
  mt-10
  uppercase text-white/90 hover:text-white
transition
duration-500
  ">
                  BUILT <br />
                  TO SCALE
                </h1>

                <p className="
  text-gray-400
  max-w-2xl
  mx-auto
  mt-10
  text-xl
  leading-9
  ">
                  Manufacturing systems designed for modern
                  sportswear brands worldwide.
                </p>

              </section>

              <div className="max-w-7xl mx-auto border-t border-white/5" />
              <div className="
absolute
w-[500px]
h-[500px]
bg-cyan-500/10
blur-[140px]
rounded-full
top-0
left-1/2
-translate-x-1/2
pointer-events-none
" />

              {/* SPLIT SECTION */}
              <section className="py-40 px-6 relative overflow-hidden">

                <div className="grid md:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">

                  <div className="group relative overflow-hidden rounded-[40px]">

                    <img
                      src="https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1600&auto=format&fit=crop"
                      loading="lazy"
                      className="
  w-full
  h-full
  rounded-[40px]
  object-cover
  group-hover:scale-110
  transition-all duration-700 ease-out
  transform-gpu
  will-change-transform
  "
                    />
                    <div className="absolute inset-0 bg-black/20" />

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
                      className="mt-10 border border-white/20 px-8 py-4 rounded-full hover:bg-white
hover:text-black
hover:scale-105
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]"
                    >
                      View Products
                    </button>

                  </div>

                </div>

              </section>

              <div className="max-w-7xl mx-auto border-t border-white/5 hover:text-white
transition
duration-500" />

              {/* MANUFACTURING SERVICES */}
              <section className="py-40 px-6 bg-[#111827]">

                <div className="text-center mb-24">

                  <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                    SERVICES
                  </p>

                  <h1 className="
text-5xl
md:text-7xl
font-bold
mt-6
leading-tight
tracking-tight
">
                    Manufacturing Services
                  </h1>

                </div>

                <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">

                  <div className="
group
bg-white
rounded-[40px]
overflow-hidden
text-black
hover:-translate-y-4
transition-all duration-700
shadow-2xl
relative
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">

                    <img
                      src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1600&auto=format&fit=crop"
                      loading="lazy"
                      className="
  w-full
  h-72
  rounded-[40px]
  object-cover
  group-hover:scale-110
  transition-all duration-700 ease-out
  transform-gpu
  will-change-transform
  "
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

                  <div className="
group
bg-white
rounded-[40px]
overflow-hidden
text-black
hover:-translate-y-4
transition-all duration-700
shadow-2xl
relative
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">

                    <img
                      src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop"
                      loading="lazy"
                      className="
  w-full
  h-72
  rounded-[40px]
  object-cover
  group-hover:scale-110
  transition-all duration-700 ease-out
  transform-gpu
  will-change-transform
  "
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

                  <div className="
group
bg-white
rounded-[40px]
overflow-hidden
text-black
hover:-translate-y-4
transition-all duration-700
shadow-2xl
relative
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">

                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1600&auto=format&fit=crop"
                      loading="lazy"
                      className="
  w-full
  h-72
  rounded-[40px]
  object-cover
  group-hover:scale-110
  transition-all duration-700 ease-out
  transform-gpu
  will-change-transform
  "
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

                  <div className="
group
bg-white
rounded-[40px]
overflow-hidden
text-black
hover:-translate-y-4
transition-all duration-700
shadow-2xl
relative
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.06]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
before:duration-500
">

                    <img
                      src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop"
                      className="
h-72 w-full rounded-[40px] object-cover
group-hover:scale-110
transition-all duration-700 ease-out
"
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

              <div className="max-w-7xl mx-auto border-t border-white/5" />

              {/* TESTIMONIALS */}
              <section className="py-40 px-6 bg-white/[0.02]">

                <div className="text-center mb-24">

                  <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                    CLIENTS
                  </p>

                  <h1 className="
text-5xl
md:text-7xl
font-bold
mt-6
leading-tight
tracking-tight
hover:text-white
transition
duration-500
">
                    Trusted Worldwide
                  </h1>

                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

                  <div className="
border border-white/10
p-10
rounded-[40px]
bg-white/[0.03]
backdrop-blur-xl
hover:bg-white/[0.05]
hover:-translate-y-5
hover:scale-[1.02]
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
">

                    <div className="flex items-center gap-4 mb-6">

                      <div className="w-14 h-14 rounded-full bg-white/10" />

                      <div>
                        <h3 className="font-bold">UK Distributor</h3>
                        <p className="text-gray-500 text-sm">
                          London, United Kingdom
                        </p>
                      </div>

                    </div>

                    <p className="text-gray-300 leading-8">
                      “Outstanding product quality and
                      fast international delivery.”
                    </p>

                  </div>

                  <div className="
border border-white/10
p-10
rounded-[40px]
bg-white/[0.03]
backdrop-blur-xl
hover:bg-white/[0.05]
hover:-translate-y-5
hover:scale-[1.02]
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
">

                    <div className="flex items-center gap-4 mb-6">

                      <div className="w-14 h-14 rounded-full bg-white/10" />

                      <div>
                        <h3 className="font-bold">Germany Brand Owner</h3>
                        <p className="text-gray-500 text-sm">
                          Berlin, Germany
                        </p>
                      </div>

                    </div>

                    <p className="text-gray-300 leading-8">
                      “Professional OEM manufacturing with
                      premium stitching quality.”
                    </p>

                  </div>

                  <div className="
border border-white/10
p-10
rounded-[40px]
bg-white/[0.03]
backdrop-blur-xl
hover:bg-white/[0.05]
hover:-translate-y-5
hover:scale-[1.02]
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
">

                    <div className="flex items-center gap-4 mb-6">

                      <div className="w-14 h-14 rounded-full bg-white/10" />

                      <div>
                        <h3 className="font-bold">UAE Importer</h3>
                        <p className="text-gray-500 text-sm">
                          Dubai, UAE
                        </p>
                      </div>

                    </div>

                    <p className="text-gray-300 leading-8">
                      “One of the best sportswear suppliers
                      we’ve worked with.”
                    </p>



                  </div>

                </div>

              </section>

              <div className="max-w-7xl mx-auto border-t border-white/5" />
              <div className="
absolute
w-[500px]
h-[500px]
bg-cyan-500/10
blur-[140px]
rounded-full
top-0
left-1/2
-translate-x-1/2
pointer-events-none
" />
              {/* MANUFACTURING INFO */}
              <section className="py-40 px-6 bg-white/[0.02]">

                <div className="text-center mb-24">

                  <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                    MANUFACTURING DETAILS
                  </p>

                  <h1 className="
text-5xl
md:text-7xl
font-bold
mt-6
leading-tight
tracking-tight hover:text-white
transition
duration-500
">
                    Export Process
                  </h1>

                </div>

                <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">

                  {/* MOQ */}
                  <div className="
group  overflow-hidden border border-white/10
rounded-[40px]
p-10
bg-gradient-to-b
from-black
to-zinc-900
hover:border-white/30
hover:-translate-y-5
hover:scale-[1.02]
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
">

                    <h2 className="text-3xl font-black tracking-tight group-hover:translate-x-2 transition duration-500">
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
                  <div className="
group overflow-hidden border border-white/10
rounded-[40px]
p-10
bg-gradient-to-b
from-black
to-zinc-900
hover:border-white/30
hover:-translate-y-5
hover:scale-[1.02]
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
">

                    <h2 className="text-3xl font-black tracking-tight group-hover:translate-x-2 transition duration-500">
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
                  <div className="
group overflow-hidden border border-white/10
rounded-[40px]
p-10
bg-gradient-to-b
from-black
to-zinc-900
hover:border-white/30
hover:-translate-y-5
hover:scale-[1.02]
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
">

                    <h2 className="text-3xl font-black tracking-tight group-hover:translate-x-2 transition duration-500">
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
                  <div className="
group overflow-hidden border border-white/10
rounded-[40px]
p-10
bg-gradient-to-b
from-black
to-zinc-900
hover:border-white/30
hover:-translate-y-5
hover:scale-[1.02]
transition-all duration-500
hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
">

                    <h2 className="text-3xl font-black tracking-tight group-hover:translate-x-2 transition duration-500">
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
























































              ```tsx
              {/* FINAL CTA */}
              <section className="
relative
overflow-hidden
text-center
py-[220px]
px-6
">

                {/* GLOW */}
                <div className="
  absolute
  top-1/2
  left-1/2
  -translate-x-1/2
  -translate-y-1/2
  w-[900px]
  h-[900px]
  bg-cyan-500/10
  blur-[180px]
  rounded-full
  pointer-events-none
  " />

                <div className="relative z-10">

                  <p className="uppercase tracking-[10px] text-gray-500 text-sm">
                    FUTURE OF SPORTSWEAR
                  </p>

                  <h1 className="
    text-[70px]
    md:text-[180px]
    font-black
    mt-10
    leading-[0.9]
    tracking-[-8px]
    uppercase
    text-white/90
    hover:text-white
    transition-all
    duration-700
    ">
                    ELEVATE <br />
                    YOUR BRAND
                  </h1>

                  <p className="
    max-w-3xl
    mx-auto
    mt-10
    text-xl
    leading-9
    text-gray-400
    ">
                    Built for modern sportswear brands,
                    private labels and global distributors
                    that demand premium manufacturing.
                  </p>

                  <button
                    onClick={() => setView("shop")}
                    className="
      group
      mt-14
      relative
      overflow-hidden
      bg-white
      text-black
      px-12
      py-5
      rounded-full
      text-xl
      font-semibold
      hover:scale-105
      transition-all
      duration-500
      hover:shadow-[0_20px_80px_rgba(255,255,255,0.25)]
      "
                  >

                    <span className="
      absolute
      inset-0
      translate-x-[-120%]
      group-hover:translate-x-[120%]
      transition-transform
      duration-1000
      bg-gradient-to-r
      from-transparent
      via-white/60
      to-transparent
      " />

                    <span className="relative z-10">
                      Explore Products
                    </span>

                  </button>

                </div>

              </section>

            </div>

)}

            {/* ABOUT */}

            {view === "about" && (

              <div className="relative overflow-hidden">

                {/* TOP GLOW */}
                <div className="
  absolute
  w-[700px]
  h-[700px]
  bg-cyan-500/10
  blur-[160px]
  rounded-full
  left-1/2
  top-0
  -translate-x-1/2
  pointer-events-none
  " />

                {/* HERO */}
                <section className="
  relative
  min-h-screen
  flex
  items-center
  justify-center
  text-center
  overflow-hidden
  ">

                  <img
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1600&auto=format&fit=crop"
                    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
      opacity-20
      scale-110
      "
                  />

                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                  <div className="relative z-10 max-w-5xl mx-auto px-6">

                    <p className="uppercase tracking-[10px] text-gray-500 text-sm">
                      TS EXPORTS
                    </p>

                    <h1 className="
      text-[70px]
      md:text-[170px]
      font-black
      leading-[0.9]
      tracking-[-8px]
      uppercase
      mt-8
      ">
                      About <br />
                      TS Exports
                    </h1>

                    <p className="
      text-gray-400
      mt-10
      max-w-3xl
      mx-auto
      leading-9
      text-xl
      ">
                      We are a Sialkot-based premium sportswear manufacturer
                      specializing in high-performance apparel for global brands,
                      clubs and distributors worldwide.
                    </p>

                  </div>

                </section>

                <div className="px-6 py-24 max-w-7xl mx-auto">

                  {/* STATS */}
                  <div className="grid md:grid-cols-4 gap-6 mb-32">

                    {aboutStats.map((s, i) => (

                      <div
                        key={i}
                        className="
          group
          relative
          overflow-hidden
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          rounded-[35px]
          p-10
          text-center
          hover:-translate-y-4
          hover:scale-[1.03]
          transition-all
          duration-700
          hover:shadow-[0_20px_80px_rgba(255,255,255,0.08)]
          "
                      >

                        <div className="
          absolute
          inset-0
          bg-gradient-to-b
          from-white/[0.08]
          to-transparent
          opacity-0
          group-hover:opacity-100
          transition
          duration-500
          " />

                        <h2 className="
          relative z-10
          text-5xl
          md:text-6xl
          font-black
          tracking-tight
          ">
                          {s.value}
                        </h2>

                        <p className="relative z-10 text-gray-400 mt-4">
                          {s.label}
                        </p>

                      </div>

                    ))}

                  </div>

                  {/* WHO WE ARE */}
                  <section className="grid md:grid-cols-2 gap-20 items-center mb-40">

                    <div>

                      <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                        WHO WE ARE
                      </p>

                      <h2 className="
        text-5xl
        md:text-7xl
        font-black
        mt-6
        leading-tight
        tracking-tight
        ">
                        Built For <br />
                        Global Brands
                      </h2>

                      <p className="text-gray-400 leading-9 text-lg mt-8">
                        TS Exports is built on precision manufacturing,
                        export reliability and long-term partnerships.
                        We work with brands worldwide to produce
                        custom sportswear with premium quality
                        and consistent delivery.
                      </p>

                      <p className="text-gray-400 leading-9 text-lg mt-8">
                        From concept to final production,
                        we handle fabric sourcing, sampling,
                        private labeling, bulk manufacturing,
                        packaging and worldwide export logistics.
                      </p>

                    </div>

                    <div className="
      group
      relative
      overflow-hidden
      rounded-[40px]
      ">

                      <img
                        src="https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1600&auto=format&fit=crop"
                        className="
          rounded-[40px]
          h-[650px]
          w-full
          object-cover
          group-hover:scale-110
          transition-all
          duration-700
          "
                      />

                      <div className="absolute inset-0 bg-black/20" />

                    </div>

                  </section>

                  {/* WHY CHOOSE US */}
                  <section className="mb-40">

                    <div className="text-center mb-20">

                      <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                        WHY TS EXPORTS
                      </p>

                      <h2 className="
        text-5xl
        md:text-7xl
        font-black
        mt-6
        tracking-tight
        ">
                        Why Choose Us
                      </h2>

                    </div>

                    <div className="grid md:grid-cols-2 gap-10">

                      {whyUs.map((item, i) => (

                        <div
                          key={i}
                          className="
            group
            relative
            overflow-hidden
            border
            border-white/10
            rounded-[40px]
            p-12
            bg-gradient-to-br
            from-white/[0.05]
            to-transparent
            backdrop-blur-xl
            hover:border-cyan-400/40
            hover:-translate-y-4
            hover:scale-[1.02]
            transition-all
            duration-700
            "
                        >

                          <span className="
            absolute
            right-6
            top-6
            text-[120px]
            font-black
            text-white/[0.03]
            leading-none
            pointer-events-none
            ">
                            0{i + 1}
                          </span>

                          <h3 className="text-3xl font-black tracking-tight">
                            {item.title}
                          </h3>

                          <p className="text-gray-400 mt-6 leading-8 text-lg">
                            {item.desc}
                          </p>

                        </div>

                      ))}

                    </div>

                  </section>

                  {/* WHAT WE PROVIDE */}
                  <section className="mb-40 text-center">

                    <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                      SERVICES
                    </p>

                    <h2 className="
      text-5xl
      md:text-7xl
      font-black
      mt-6
      mb-16
      tracking-tight
      ">
                      What We Provide
                    </h2>

                    <div className="flex flex-wrap justify-center gap-5">

                      {whatWeProvide.map((item, i) => (

                        <span
                          key={i}
                          className="
            group
            px-8
            py-4
            border
            border-white/10
            rounded-full
            bg-white/[0.03]
            text-gray-300
            hover:bg-white
            hover:text-black
            hover:scale-105
            transition-all
            duration-500
            cursor-pointer
            "
                        >
                          {item}
                        </span>

                      ))}

                    </div>

                  </section>

                  {/* GLOBAL REACH */}
                  <section className="py-40 relative overflow-hidden">

                    <div className="text-center mb-24">

                      <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                        GLOBAL NETWORK
                      </p>

                      <h1 className="
        text-5xl
        md:text-7xl
        font-black
        mt-6
        tracking-tight
        ">
                        Trusted Across Continents
                      </h1>

                    </div>

                    <div className="grid md:grid-cols-3 gap-8">

                      {[
                        "United Kingdom",
                        "Germany",
                        "United Arab Emirates",
                        "United States",
                        "Canada",
                        "Australia"
                      ].map((country, i) => (

                        <div
                          key={i}
                          className="
            group
            border border-white/10
            rounded-[35px]
            p-10
            bg-white/[0.03]
            hover:bg-white/[0.06]
            hover:-translate-y-5
            transition-all
            duration-500
            "
                        >

                          <h2 className="text-3xl font-bold">
                            {country}
                          </h2>

                          <p className="text-gray-400 mt-4 leading-8">
                            OEM manufacturing and export support
                            for sportswear brands and distributors.
                          </p>

                        </div>

                      ))}

                    </div>

                  </section>

                  {/* DIFFERENTIATION */}
                  <section className="text-center py-32">

                    <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                      DIFFERENTIATION
                    </p>

                    <h2 className="
      text-5xl
      md:text-7xl
      font-black
      mt-6
      tracking-tight
      ">
                      What Makes Us Different
                    </h2>

                    <p className="
      text-gray-400
      max-w-4xl
      mx-auto
      leading-9
      text-xl
      mt-10
      ">
                      Unlike traditional manufacturers,
                      we focus on brand building,
                      premium presentation,
                      scalable production systems
                      and long-term growth partnerships.
                      Our goal is not just manufacturing —
                      but helping sportswear brands grow globally.
                    </p>

                  </section>

                </div>

              </div>

            )}

            {/* SHOP */}

            {view === "shop" && (

              <>
                {/* SHOP HERO */}
                <section className="
  relative
  py-40
  text-center
  overflow-hidden
  ">

                  <div className="
    absolute
    w-[700px]
    h-[700px]
    bg-cyan-500/10
    blur-[160px]
    rounded-full
    left-1/2
    top-1/2
    -translate-x-1/2
    -translate-y-1/2
    " />

                  <div className="relative z-10">

                    <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                      PERFORMANCE COLLECTION
                    </p>

                    <h1 className="
      text-6xl
      md:text-[140px]
      font-black
      tracking-[-6px]
      leading-none
      mt-6
      ">
                      SPORTSWEAR
                    </h1>

                    <p className="
      max-w-3xl
      mx-auto
      mt-8
      text-gray-400
      text-xl
      leading-9
      ">
                      Premium custom sportswear designed
                      for modern brands and elite performance.
                    </p>

                  </div>

                </section>

                <div
                  id="products-section"
                  className="p-6 max-w-7xl mx-auto"
                >

                  {selectedCategory && (

                    <div className="mb-10 flex justify-between items-center">

                      <h2 className="text-2xl font-bold">
                        Category: {selectedCategory}
                      </h2>

                      <button
                        onClick={() => setSelectedCategory("")}
                        className="
          border
          border-white/10
          px-5
          py-3
          rounded-2xl
          hover:bg-white
          hover:text-black
          transition-all
          duration-500
          "
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
                    className="
      w-full
      p-6
      mb-12
      bg-white/[0.04]
      border
      border-white/10
      rounded-[25px]
      backdrop-blur-xl
      focus:outline-none
      focus:border-cyan-400/40
      transition-all
      duration-500
      text-lg
      "
                  />

                  {/* PRODUCTS */}
                  <div className="grid md:grid-cols-3 gap-8">

                    {filteredProducts.map((p: any) => (

                      <div
                        key={p.id}
                        className="
          group
          relative
          overflow-hidden
          border
          border-white/10
          rounded-[40px]
          bg-white/[0.03]
          backdrop-blur-xl
          hover:-translate-y-4
          hover:scale-[1.02]
          transition-all
          duration-700
          hover:shadow-[0_20px_80px_rgba(255,255,255,0.08)]
          "
                      >

                        {/* IMAGE */}
                        <div className="relative overflow-hidden">

                          <img
                            src={p.image}
                            className="
              w-full
              h-[420px]
              object-cover
              group-hover:scale-110
              transition-all
              duration-700
              "
                          />

                          <div className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-transparent
            to-transparent
            opacity-60
            pointer-events-none
            " />

                          <button className="
            absolute
            top-6
            right-6
            bg-white/10
            backdrop-blur-xl
            border
            border-white/10
            px-5
            py-2
            rounded-full
            text-sm
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-500
            ">
                            Quick View
                          </button>

                        </div>

                        {/* INFO */}
                        <div className="p-8">

                          <h2 className="text-3xl font-black tracking-tight">
                            {p.name}
                          </h2>

                          <p className="text-gray-400 mt-3">
                            {p.category}
                          </p>

                          <div className="flex justify-between items-center mt-6">

                            <p className="text-gray-300">
                              MOQ: {p.moq}
                            </p>

                            <p className="text-4xl font-black">
                              ${p.price}
                            </p>

                          </div>

                          <a
                            href={`https://wa.me/923428145366?text=Hello, I want to inquire about: ${p.name}`}
                            target="_blank"
                            className="
              mt-8
              block
              text-center
              bg-green-500
              text-white
              py-4
              rounded-2xl
              font-semibold
              hover:scale-[1.02]
              transition-all
              duration-500
              "
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
                            className="
              mt-4
              w-full
              bg-white
              text-black
              py-4
              rounded-2xl
              font-semibold
              hover:scale-[1.02]
              transition-all
              duration-500
              "
                          >
                            Request Quote
                          </button>

                          {admin && (

                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="
                mt-5
                w-full
                border
                border-red-500
                text-red-500
                py-4
                rounded-2xl
                hover:bg-red-500
                hover:text-white
                transition-all
                duration-500
                "
                            >
                              Delete Product
                            </button>

                          )}

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              </>

            )}
            ```



























































            {/* ================= ULTRA PREMIUM LEGAL + FOOTER SECTION ================= */}



            {/* ================= PRIVACY POLICY ================= */}
            {view === "privacy" && (

              <div className="bg-black text-white overflow-hidden">

                {/* BACKGROUND GLOW */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 blur-[160px] rounded-full pointer-events-none" />

                {/* HERO */}
                <section className="relative py-48 px-6 text-center overflow-hidden">

                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.05] to-transparent" />

                  <div className="relative z-10 max-w-6xl mx-auto">

                    <p className="uppercase tracking-[12px] text-gray-500 text-sm">
                      TS EXPORTS
                    </p>

                    <h1 className="
text-7xl
md:text-[170px]
font-black
tracking-tight
uppercase
leading-none
mt-8
text-white
">
                      Privacy <br />
                      Policy
                    </h1>

                    <p className="text-gray-400 max-w-3xl mx-auto mt-10 leading-9 text-xl">
                      Transparency, protection and secure business communication
                      designed for modern global manufacturing partnerships.
                    </p>

                  </div>

                </section>

                {/* GLASS GRID */}
                <section className="max-w-7xl mx-auto px-6 pb-32">

                  <div className="grid md:grid-cols-2 gap-10">

                    {[
                      {
                        title: "Information Collection",
                        desc: "We may collect customer names, business emails, shipping information, inquiry details and production-related communication for operational purposes."
                      },
                      {
                        title: "How Information Is Used",
                        desc: "Information is used for order processing, communication, production updates, customer support and long-term manufacturing relationships."
                      },
                      {
                        title: "Security Infrastructure",
                        desc: "TS Exports implements restricted-access systems and secure workflows to protect customer information from unauthorized access."
                      },
                      {
                        title: "Third Party Services",
                        desc: "Trusted logistics and analytics providers may process limited operational data required for export and business functionality."
                      }
                    ].map((item, i) => (

                      <div
                        key={i}
                        className="
group
relative
overflow-hidden
border border-white/10
rounded-[40px]
p-12
bg-white/[0.03]
backdrop-blur-xl
hover:border-cyan-400/40
hover:-translate-y-5
transition-all duration-700
before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-white/[0.05]
before:to-transparent
before:opacity-0
hover:before:opacity-100
before:transition
"
                      >

                        <div className="relative z-10">

                          <div className="
w-14 h-14 rounded-2xl
bg-white/[0.06]
border border-white/10
flex items-center justify-center
text-xl font-bold
mb-8
group-hover:scale-110
transition
duration-500
">
                            0{i + 1}
                          </div>

                          <h2 className="text-3xl font-black tracking-tight">
                            {item.title}
                          </h2>

                          <p className="text-gray-400 leading-8 mt-6">
                            {item.desc}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                  {/* HUGE GLASS PANEL */}
                  <div className="
mt-24
relative
overflow-hidden
border border-white/10
rounded-[50px]
p-16
bg-gradient-to-br from-white/[0.04] to-transparent
backdrop-blur-2xl
">

                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.04] to-transparent" />

                    <div className="relative z-10">

                      <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                        SECURE DIGITAL OPERATIONS
                      </p>

                      <h2 className="text-5xl md:text-7xl font-black mt-8 leading-tight">
                        Data <br />
                        Transparency
                      </h2>

                      <p className="text-gray-400 leading-9 text-xl max-w-4xl mt-10">
                        Customer information is never sold or distributed for unauthorized purposes.
                        We continuously improve our digital systems, export workflows and inquiry
                        infrastructure to maintain secure communication and reliable business operations.
                      </p>

                    </div>

                  </div>
                </section>

              </div>

            )}



            {/* ================= TERMS ================= */}
            {view === "terms" && (

              <div className="bg-black text-white overflow-hidden">

                {/* HERO */}
                <section className="relative py-48 px-6 text-center">

                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

                  <div className="relative z-10">

                    <p className="uppercase tracking-[12px] text-gray-500 text-sm">
                      BUSINESS TERMS
                    </p>

                    <h1 className="
text-7xl
md:text-[120px]
font-black
leading-none
tracking-tight
uppercase
mt-8
">
                      Terms & <br />
                      Conditions
                    </h1>

                    <p className="text-gray-400 max-w-3xl mx-auto mt-10 text-xl leading-9">
                      Manufacturing agreements designed for modern OEM,
                      private label and export operations.
                    </p>

                  </div>

                </section>

                {/* STACKED CARDS */}
                <section className="max-w-6xl mx-auto px-6 pb-32 space-y-10">

                  {[
                    {
                      title: "Orders & Confirmation",
                      desc: "Production begins only after final design approval, payment verification and confirmation from both parties."
                    },
                    {
                      title: "Manufacturing Timelines",
                      desc: "Timelines vary depending on customization, fabric sourcing and production quantity requirements."
                    },
                    {
                      title: "Payments",
                      desc: "Customers must complete agreed payment terms before shipment dispatch and export processing."
                    },
                    {
                      title: "Intellectual Property",
                      desc: "Customer branding, logos and artwork remain property of their respective owners."
                    }
                  ].map((item, i) => (

                    <div
                      key={i}
                      className="
group
relative
overflow-hidden
border border-white/10
rounded-[40px]
p-14
bg-white/[0.03]
backdrop-blur-xl
hover:border-cyan-400/40
hover:-translate-y-2
transition-all duration-700
"
                    >

                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-700" />

                      <div className="flex flex-col md:flex-row md:items-start gap-10">

                        <div className="
text-6xl
font-black
text-white/10
leading-none
">
                          0{i + 1}
                        </div>

                        <div>

                          <h2 className="text-4xl font-black tracking-tight">
                            {item.title}
                          </h2>

                          <p className="text-gray-400 leading-9 text-lg mt-6 max-w-4xl">
                            {item.desc}
                          </p>

                        </div>

                      </div>
                    </div>

                  ))}

                </section>

              </div>

            )}



            {/* ================= SHIPPING ================= */}
            {view === "shipping" && (

              <div className="bg-black text-white overflow-hidden">

                {/* HERO */}
                <section className="relative py-48 px-6 text-center">

                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.05] to-transparent" />

                  <div className="relative z-10">

                    <p className="uppercase tracking-[10px] text-gray-500 text-sm">
                      GLOBAL EXPORT SYSTEM
                    </p>

                    <h1 className="
text-7xl
md:text-[120px]
font-black
leading-none
tracking-tight
uppercase
mt-8
">
                      Shipping <br />
                      Policy
                    </h1>

                    <p className="text-gray-400 max-w-3xl mx-auto mt-10 text-xl leading-9">
                      Reliable worldwide export logistics
                      for samples, OEM manufacturing and bulk production.
                    </p>

                  </div>

                </section>

                {/* TIMELINE CARDS */}
                <section className="max-w-7xl mx-auto px-6 pb-32">

                  <div className="grid md:grid-cols-3 gap-8">

                    {[
                      {
                        title: "Sample Orders",
                        time: "5–7 DAYS",
                        desc: "Fast prototype and sample development workflows."
                      },
                      {
                        title: "Bulk Production",
                        time: "2–4 WEEKS",
                        desc: "Efficient manufacturing systems for scalable production."
                      },
                      {
                        title: "Worldwide Delivery",
                        time: "GLOBAL",
                        desc: "Reliable export logistics and international dispatch."
                      }
                    ].map((item, i) => (

                      <div
                        key={i}
                        className="
group
relative
overflow-hidden
rounded-[40px]
border border-white/10
p-12
bg-gradient-to-b from-white/[0.04] to-transparent
hover:border-cyan-400/40
hover:-translate-y-5
transition-all duration-700
"
                      >

                        <h2 className="text-3xl font-black">
                          {item.title}
                        </h2>

                        <h1 className="
text-6xl
font-black
mt-8
bg-gradient-to-r from-white to-gray-500
bg-clip-text text-transparent
">
                          {item.time}
                        </h1>

                        <p className="text-gray-400 leading-8 mt-8">
                          {item.desc}
                        </p>

                      </div>

                    ))}

                  </div>

                  {/* MASSIVE PANEL */}
                  <div className="
mt-24
rounded-[50px]
border border-white/10
p-16
bg-white/[0.03]
backdrop-blur-2xl
relative
overflow-hidden
">

                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.04] to-transparent" />

                    <div className="relative z-10">

                      <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                        EXPORT SUPPORT
                      </p>

                      <h2 className="text-5xl md:text-7xl font-black mt-8">
                        Logistics <br />
                        Assistance
                      </h2>

                      <p className="text-gray-400 leading-9 text-xl mt-10 max-w-4xl">
                        Complete export coordination including invoices,
                        shipment handling, packaging standards,
                        tracking support and international dispatch operations.
                      </p>

                    </div>

                  </div>

                </section>

              </div>

            )}



            {/* ================= FLOATING BLOG PREVIEW ================= */}
            <section className="relative py-44 px-6 bg-[#f5f5f5] text-black overflow-hidden">

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-black/[0.03] blur-[120px] rounded-full pointer-events-none" />

              <div className="relative z-10 text-center mb-24">

                <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                  INSIGHTS
                </p>

                <h1 className="
text-6xl
md:text-8xl
font-black
tracking-tight
mt-8
leading-none
">
                  Latest <br />
                  Articles
                </h1>

              </div>

              <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">

                {[
                  {
                    title: "How Premium Sportswear Is Manufactured",
                    category: "Manufacturing",
                    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
                  },
                  {
                    title: "Building A Global Sportswear Brand",
                    category: "Branding",
                    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
                  },
                  {
                    title: "Why Sialkot Leads Sportswear Exports",
                    category: "Export",
                    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb"
                  }
                ].map((blog, i) => (

                  <div
                    key={i}
                    className="
group
bg-white
rounded-[40px]
overflow-hidden
shadow-[0_30px_100px_rgba(0,0,0,0.08)]
hover:-translate-y-4
transition-all duration-700
"
                  >

                    <div className="overflow-hidden">

                      <img
                        src={blog.image}
                        className="
h-80 w-full object-cover
group-hover:scale-110
transition-all duration-700
"
                      />

                    </div>

                    <div className="p-10">

                      <p className="uppercase tracking-[5px] text-gray-500 text-sm">
                        {blog.category}
                      </p>

                      <h2 className="text-4xl font-black mt-6 leading-tight">
                        {blog.title}
                      </h2>

                      <button className="
mt-8
border border-black/10
px-6 py-3
rounded-full
hover:bg-black
hover:text-white
transition-all duration-500
">
                        Read More
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </section>



            {/* ================= MASSIVE FINAL CTA ================= */}
            <section className="relative py-[220px] px-6 text-center overflow-hidden bg-black text-white">

              {/* GLOW */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-cyan-500/10 blur-[180px] rounded-full" />

              <div className="relative z-10 max-w-6xl mx-auto">

                <p className="uppercase tracking-[12px] text-gray-500 text-sm">
                  START YOUR BRAND
                </p>

                <h1 className="
text-7xl
md:text-[170px]
font-black
leading-none
tracking-tight
uppercase
mt-10
">
                  LET’S BUILD <br />
                  SOMETHING GREAT
                </h1>

                <p className="
text-gray-400
max-w-3xl
mx-auto
mt-12
text-2xl
leading-10
">
                  Premium OEM sportswear manufacturing
                  designed for modern global brands and distributors.
                </p>

                {/* BUTTONS */}
                <div className="flex flex-col md:flex-row gap-6 justify-center mt-16">

                  <button
                    onClick={() => setView("contact")}
                    className="
bg-white
text-black
px-10 py-5
rounded-full
font-bold
hover:scale-105
transition-all duration-500
"
                  >
                    Start Your Project
                  </button>

                  <button
                    onClick={() => setView("shop")}
                    className="
border border-white/20
px-10 py-5
rounded-full
hover:bg-white
hover:text-black
transition-all duration-500
"
                  >
                    Explore Products
                  </button>

                </div>

              </div>

            </section>



            {/* ================= ULTRA PREMIUM FOOTER ================= */}
            <footer className="relative overflow-hidden bg-[#050505] text-white border-t border-white/10">

              {/* HUGE BACKGROUND TEXT */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                <h1 className="
text-[120px]
md:text-[280px]
font-black
tracking-tight
text-white/[0.02]
leading-none
select-none
">
                  TS EXPORTS
                </h1>

              </div>

              {/* GLOW */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 blur-[160px] rounded-full" />

              <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">

                {/* TOP GRID */}
                <div className="grid md:grid-cols-4 gap-20">

                  {/* BRAND */}
                  <div>

                    <h1 className="text-4xl font-black tracking-[8px]">
                      TS EXPORTS
                    </h1>

                    <p className="text-gray-400 mt-8 leading-8">
                      Premium sportswear manufacturer from Sialkot
                      producing export-quality apparel for brands,
                      teams and distributors worldwide.
                    </p>

                    {/* SOCIALS */}
                    <div className="flex gap-4 mt-10">

                      {["IG", "FB", "WA"].map((s, i) => (

                        <a
                          key={i}
                          href={
                            s === "WA"
                              ? "https://wa.me/923428145366"
                              : s === "IG"
                                ? "https://instagram.com"
                                : "https://facebook.com"
                          }
                          target="_blank"
                          className="
w-14 h-14 rounded-full
border border-white/10
bg-white/[0.03]
flex items-center justify-center
hover:bg-white
hover:text-black
hover:scale-110
transition-all duration-500
"
                        >
                          {s}
                        </a>

                      ))}

                    </div>

                  </div>

                  {/* QUICK LINKS */}
                  <div>

                    <h2 className="text-2xl font-bold mb-10">
                      Navigation
                    </h2>

                    <div className="space-y-5 text-gray-400">

                      {[
                        ["Home", "home"],
                        ["About", "about"],
                        ["Products", "shop"],
                        ["Blogs", "blogs"],
                        ["Contact", "contact"]
                      ].map(([label, viewName], i) => (

                        <button
                          key={i}
                          onClick={() => setView(viewName)}
                          className="
block
hover:text-white
hover:translate-x-2
transition-all duration-500
"
                        >
                          {label}
                        </button>

                      ))}

                    </div>

                  </div>

                  {/* CONTACT */}
                  <div>

                    <h2 className="text-2xl font-bold mb-10">
                      Contact
                    </h2>

                    <div className="space-y-8 text-gray-400">

                      <div>
                        <p className="text-white font-semibold mb-2">
                          Location
                        </p>

                        <p>Sialkot, Pakistan</p>
                      </div>

                      <div>
                        <p className="text-white font-semibold mb-2">
                          Email
                        </p>

                        <p>info@tsexports.com</p>
                      </div>

                      <div>
                        <p className="text-white font-semibold mb-2">
                          WhatsApp
                        </p>

                        <p>+92 342 8145366</p>
                      </div>
                    </div>

                  </div>

                  {/* NEWSLETTER */}
                  <div>

                    <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                      NEWSLETTER
                    </p>

                    <h2 className="text-4xl font-black mt-6 leading-tight">
                      Stay Updated
                    </h2>

                    <p className="text-gray-400 mt-6 leading-8">
                      Subscribe for manufacturing insights,
                      product launches and export updates.
                    </p>

                    <div className="mt-8 space-y-4">

                      <input
                        placeholder="Enter your email"
                        value={subscriberEmail}
                        onChange={(e) =>
                          setSubscriberEmail(e.target.value)
                        }
                        className="
w-full
bg-white/[0.04]
border border-white/10
px-6 py-4
rounded-full
outline-none
focus:border-cyan-400/40
"
                      />

                      <button
                        onClick={async () => {

                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                          if (!subscriberEmail || !emailRegex.test(subscriberEmail)) {

                            alert("Please enter a valid email.");
                            return;

                          }

                          try {

                            await addDoc(collection(db, "subscribers"), {
                              email: subscriberEmail,
                              time: new Date().toISOString()
                            });

                            alert("Subscribed successfully!");
                            setSubscriberEmail("");

                          } catch {

                            alert("Something went wrong.");

                          }

                        }}
                        className="
w-full
bg-white
text-black
py-4
rounded-full
font-bold
hover:scale-[1.02]
transition-all duration-500
"
                      >
                        Subscribe
                      </button>

                    </div>

                  </div>

                </div>

                {/* BOTTOM */}
                <div className="
mt-24
pt-10
border-t border-white/10
flex flex-col md:flex-row
justify-between
items-center
gap-6
text-gray-500
text-sm
">

                  <p>
                    © 2026 TS Exports. All rights reserved.
                  </p>

                  <div className="flex flex-wrap gap-8">

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