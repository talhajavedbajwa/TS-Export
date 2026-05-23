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

          {/* HERO */}

          <div className="text-center py-28 px-6">

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Premium Sportswear Export <br />
              From Sialkot
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto mt-8 text-lg leading-8">
              Manufacturing export-quality football kits,
              cricket uniforms, gym wear and custom apparel
              for global brands.
            </p>

            <button
              onClick={() => setView("shop")}
              className="mt-10 bg-white text-black px-8 py-4 rounded-full text-lg"
            >
              Explore Products
            </button>

          </div>

          {/* FEATURES */}

          <div className="grid md:grid-cols-3 gap-6 px-10">

            <div className="border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold">
                Premium Quality
              </h2>

              <p className="text-gray-400 mt-4 leading-7">
                High-end stitching and export fabrics.
              </p>
            </div>

            <div className="border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold">
                Worldwide Shipping
              </h2>

              <p className="text-gray-400 mt-4 leading-7">
                Delivering products globally with reliability.
              </p>
            </div>

            <div className="border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold">
                Low MOQ
              </h2>

              <p className="text-gray-400 mt-4 leading-7">
                Flexible quantities for all businesses.
              </p>
            </div>

          </div>

          {/* PREMIUM SECTION */}

          <div className="mt-40 space-y-40">

            <div className="text-center px-6">

              <p className="uppercase tracking-[8px] text-gray-500 text-sm">
                TS EXPORTS
              </p>

              <h1 className="text-6xl md:text-8xl font-bold mt-6 leading-tight">
                Built For <br />
                Global Brands
              </h1>

              <p className="max-w-2xl mx-auto text-gray-400 mt-8 text-lg leading-8">
                Premium sportswear manufacturing from Sialkot
                with modern fabrics, precision production and
                worldwide export.
              </p>

            </div>

            <div className="px-6">

              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
                className="w-full h-[700px] object-cover rounded-3xl"
              />

            </div>

            {/* STATS */}

            <div className="grid md:grid-cols-4 gap-6 px-10 text-center">

              <div className="border border-white/10 p-8 rounded-2xl">
                <h1 className="text-5xl font-bold">
                  50+
                </h1>

                <p className="text-gray-400 mt-2">
                  Global Clients
                </p>
              </div>

              <div className="border border-white/10 p-8 rounded-2xl">
                <h1 className="text-5xl font-bold">
                  20K+
                </h1>

                <p className="text-gray-400 mt-2">
                  Products Exported
                </p>
              </div>

              <div className="border border-white/10 p-8 rounded-2xl">
                <h1 className="text-5xl font-bold">
                  15+
                </h1>

                <p className="text-gray-400 mt-2">
                  Countries
                </p>
              </div>

              <div className="border border-white/10 p-8 rounded-2xl">
                <h1 className="text-5xl font-bold">
                  24/7
                </h1>

                <p className="text-gray-400 mt-2">
                  Support
                </p>
              </div>

            </div>

            {/* FINAL CTA */}

            <div className="text-center py-32">

              <h1 className="text-7xl md:text-9xl font-bold leading-none">
                ELEVATE <br />
                YOUR BRAND
              </h1>

              <button
                onClick={() => setView("shop")}
                className="mt-10 bg-white text-black px-10 py-4 rounded-full text-lg"
              >
                Explore Collection
              </button>

            </div>

          </div>

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

      {/* FOOTER */}

      <footer className="border-t border-white/10 mt-32 py-10 px-6 text-center">

        <h2 className="text-2xl font-bold">
          TS EXPORTS
        </h2>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto leading-7">
          Premium sportswear manufacturer from Sialkot, Pakistan.
          Exporting high-quality custom sports apparel worldwide.
        </p>

        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500 flex-wrap">
          <p>Football Wear</p>
          <p>Gym Wear</p>
          <p>Cricket Uniforms</p>
          <p>Custom Apparel</p>
        </div>

        <p className="text-gray-600 text-sm mt-8">
          © 2026 TS Exports. All rights reserved.
        </p>

      </footer>

    </div>

  );
}