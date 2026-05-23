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

/* ---------------- FIREBASE CONFIG ---------------- */
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

/* ---------------- MAIN APP ---------------- */
export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [admin, setAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [view, setView] = useState("home");

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

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
      if (u?.email === "admin@tsexports.com") setAdmin(true);
    });

    loadProducts();

    return () => unsub();
  }, []);

  async function loadProducts() {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

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
    if (!admin) return alert("Not admin");
    await addDoc(collection(db, "products"), form);
    setForm({ name: "", price: "", category: "", image: "", moq: "" });
    loadProducts();
  }

  async function deleteProduct(id: any) {
    if (!admin) return;
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  }

  /* ---------------- FILTERED PRODUCTS ---------------- */
  const filteredProducts = products.filter((p: any) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center p-4 border-b border-white/10 sticky top-0 bg-black z-50">
        <h1 className="font-bold text-xl">TS EXPORTS</h1>

        <div className="flex gap-4 text-sm">
          <button onClick={() => setView("home")}>Home</button>
          <button onClick={() => setView("shop")}>Products</button>
          <button onClick={() => setView("about")}>About</button>
          <button onClick={() => setView("admin")}>Admin</button>
        </div>
      </div>

      {/* HOME */}
      {view === "home" && (
        <div className="text-center py-24 px-4">

          <h1 className="text-5xl font-bold">
            Premium Sportswear Export From Sialkot
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            We manufacture premium football kits, cricket uniforms,
            gym wear and custom sportswear for global brands.
          </p>

          <button
            onClick={() => setView("shop")}
            className="mt-6 bg-white text-black px-6 py-3 rounded"
          >
            Explore Products
          </button>

          <div className="grid md:grid-cols-3 gap-6 mt-20 px-10">

            <div className="border border-white/10 p-6 rounded">
              <h2 className="font-bold text-xl">Premium Quality</h2>
              <p className="text-gray-400 mt-2">
                Export-quality stitching and fabrics.
              </p>
            </div>

            <div className="border border-white/10 p-6 rounded">
              <h2 className="font-bold text-xl">Worldwide Shipping</h2>
              <p className="text-gray-400 mt-2">
                Delivering products globally.
              </p>
            </div>

            <div className="border border-white/10 p-6 rounded">
              <h2 className="font-bold text-xl">Low MOQ</h2>
              <p className="text-gray-400 mt-2">
                Flexible minimum order quantities.
              </p>
            </div>

          </div>

          {/* 🍎 APPLE STYLE END SECTION */}
          <div className="mt-32 relative flex flex-col items-center justify-center text-center">

            <h1 className="text-[120px] md:text-[180px] font-bold text-white/5 select-none leading-none">
              SCROLL
            </h1>

            <div className="absolute">
              <p className="text-gray-400 tracking-[6px] uppercase text-xs">
                Continue Exploring
              </p>

              <h2 className="text-2xl md:text-4xl font-light mt-3 text-white/80">
                Crafted for Global Performance
              </h2>

              <div className="w-24 h-[1px] bg-white/20 mx-auto mt-6"></div>

              <p className="text-gray-500 text-sm mt-6">
                Designed with precision • Built in Sialkot • Exported worldwide
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ABOUT */}
      {view === "about" && (
        <div className="max-w-4xl mx-auto px-6 py-20">

          <h1 className="text-4xl font-bold mb-6">
            About TS Exports
          </h1>

          <p className="text-gray-300 leading-8">
            TS Exports is a Sialkot-based sportswear manufacturer
            specializing in football kits, cricket uniforms,
            gym wear and custom team apparel.
          </p>

        </div>
      )}

      {/* SHOP */}
      {view === "shop" && (
        <div className="p-6">

          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 mb-8 bg-white/10 border border-white/20 rounded"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {filteredProducts.map((p: any) => (
              <div key={p.id} className="border border-white/10 rounded overflow-hidden">

                <img src={p.image} className="h-56 w-full object-cover" />

                <div className="p-4">
                  <h2 className="font-bold text-xl">{p.name}</h2>
                  <p className="text-gray-400 mt-1">{p.category}</p>
                  <p className="mt-2">MOQ: {p.moq}</p>
                  <p className="font-bold text-2xl mt-2">${p.price}</p>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN */}
      {view === "admin" && (
        <div className="p-6 max-w-md mx-auto">

          {!user ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

              <input
                placeholder="Email"
                className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button onClick={login} className="w-full bg-white text-black py-3 rounded mb-3">
                Login
              </button>

              <button onClick={register} className="w-full border border-white/20 py-3 rounded">
                Register
              </button>
            </>
          ) : admin ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

              <input placeholder="Product Name"
                className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input placeholder="Price"
                className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded"
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />

              <input placeholder="Category"
                className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />

              <input placeholder="Image URL"
                className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded"
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />

              <input placeholder="MOQ"
                className="w-full p-3 mb-4 bg-white/10 border border-white/20 rounded"
                onChange={(e) => setForm({ ...form, moq: e.target.value })}
              />

              <button onClick={addProduct} className="w-full bg-white text-black py-3 rounded">
                Add Product
              </button>

              <button onClick={logout} className="w-full mt-3 border border-red-500 text-red-500 py-3 rounded">
                Logout
              </button>
            </>
          ) : (
            <p>You are not admin.</p>
          )}

        </div>
      )}

    </div>
  );
}