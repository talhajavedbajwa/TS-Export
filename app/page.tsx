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

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState<any[]>([]);

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

  /* ---------------- FILTER ---------------- */

  const filteredProducts = products.filter((p: any) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

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

          <button onClick={() => setView("shop")}>
            Products
          </button>

          <button onClick={() => setView("about")}>
            About
          </button>

          <button onClick={() => setView("admin")}>
            Admin
          </button>

        </div>

      </div>

  {/* HOME */}
{view === "home" && (

  <div>

    {/* HERO SECTION */}
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">

      <img
        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 px-6">

        <p className="uppercase tracking-[10px] text-gray-400 text-sm">
          TS EXPORTS
        </p>

        <h1 className="text-6xl md:text-8xl font-bold leading-tight mt-8">
          BUILT FOR <br />
          GLOBAL BRANDS
        </h1>

        <p className="max-w-2xl mx-auto mt-8 text-gray-300 text-lg leading-8">
          Premium sportswear manufacturing from Sialkot with
          export-quality production, modern fabrics and worldwide delivery.
        </p>

        <button
          onClick={() => setView("shop")}
          className="mt-10 bg-white text-black px-8 py-4 rounded-full text-lg hover:scale-105 transition"
        >
          Explore Collection
        </button>

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

        <div className="max-w-5xl mx-auto px-6 py-24">

          <h1 className="text-5xl font-bold mb-8">
            About TS Exports
          </h1>

          <p className="text-gray-300 leading-8 text-lg">
            TS Exports is a Sialkot-based sportswear manufacturer
            specializing in football kits, cricket uniforms,
            gym wear and custom team apparel.
          </p>

          <p className="text-gray-400 leading-8 mt-6 text-lg">
            We provide export-quality manufacturing with
            competitive pricing, fast production and
            worldwide delivery.
          </p>

        </div>

      )}

      {/* SHOP */}

      {view === "shop" && (

        <div className="p-6">

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

              <input
                placeholder="Category"
                value={form.category}
                className="w-full p-4 mb-4 bg-white/10 border border-white/20 rounded-2xl"
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />

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

      {/* ULTRA PREMIUM FOOTER */}
<footer className="relative border-t border-white/10 bg-black overflow-hidden">

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

        <p className="text-gray-400 mt-8 leading-8">
          Premium sportswear manufacturer from Sialkot
          producing export-quality apparel for brands,
          teams and distributors worldwide.
        </p>

        {/* SOCIALS */}
        <div className="flex gap-4 mt-8">

          <a
            href="#"
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition"
          >
            IG
          </a>

          <a
            href="#"
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition"
          >
            FB
          </a>

          <a
            href="#"
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition"
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

        <div className="space-y-5 text-gray-400">

          <button
            onClick={() => setView("home")}
            className="block hover:text-white transition"
          >
            Home
          </button>

          <button
            onClick={() => setView("shop")}
            className="block hover:text-white transition"
          >
            Products
          </button>

          <button
            onClick={() => setView("about")}
            className="block hover:text-white transition"
          >
            About Us
          </button>

          <button className="block hover:text-white transition">
            OEM Manufacturing
          </button>

          <button className="block hover:text-white transition">
            Global Shipping
          </button>

        </div>

      </div>

      {/* COLLECTIONS */}
      <div>

        <h2 className="text-xl font-semibold mb-8">
          Collections
        </h2>

        <div className="space-y-5 text-gray-400">

          <button className="block hover:text-white transition">
            Football Wear
          </button>

          <button className="block hover:text-white transition">
            Gym Wear
          </button>

          <button className="block hover:text-white transition">
            Cricket Uniforms
          </button>

          <button className="block hover:text-white transition">
            Training Wear
          </button>

          <button className="block hover:text-white transition">
            Hoodies
          </button>

        </div>

      </div>

      {/* CONTACT */}
      <div>

        <h2 className="text-xl font-semibold mb-8">
          Contact
        </h2>

        <div className="space-y-6 text-gray-400 leading-7">

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

            <p>+92 300 0000000</p>
          </div>

        </div>

        {/* BUTTON */}
        <button className="mt-10 border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition">

          Contact Now

        </button>

      </div>

    </div>

    {/* NEWSLETTER */}
    <div className="mt-32 border-t border-white/10 pt-16">

      <div className="grid md:grid-cols-2 gap-10 items-center">

        <div>

          <p className="uppercase tracking-[8px] text-gray-500 text-sm">
            STAY UPDATED
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Subscribe For Updates
          </h2>

        </div>

        <div className="flex gap-4">

          <input
            placeholder="Enter your email"
            className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-full outline-none"
          />

          <button className="bg-white text-black px-8 rounded-full hover:scale-105 transition">

            Subscribe

          </button>

        </div>

      </div>

    </div>

    {/* BOTTOM */}
    <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">

      <p>
        © 2026 TS Exports. All rights reserved.
      </p>

      <div className="flex gap-8">

        <button className="hover:text-white transition">
          Privacy Policy
        </button>

        <button className="hover:text-white transition">
          Terms & Conditions
        </button>

        <button className="hover:text-white transition">
          Shipping Policy
        </button>

      </div>

    </div>

  </div>

</footer>
</div>
);
}
