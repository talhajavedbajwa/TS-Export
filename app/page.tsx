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
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [view, setView] = useState("home");

  const [products, setProducts] = useState([]);
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
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.email === "admin@tsexports.com") setAdmin(true);
    });

    loadProducts();
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

  async function deleteProduct(id) {
    if (!admin) return;
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  }

  /* ---------------- FILTERED PRODUCTS ---------------- */
  const filteredProducts = products.filter((p) =>
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
        <div className="text-center py-28 px-6 bg-gradient-to-b from-black to-gray-900">
          <h1 className="text-6xl font-bold">
            Sialkot Sportswear Export House
          </h1>

          <p className="text-gray-300 mt-4 text-lg">
            Premium Football • Cricket • Gym Wear Manufacturing for Global Brands
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setView("shop")}
              className="bg-white text-black px-6 py-3 rounded"
            >
              Explore Products
            </button>

            <button className="border border-white px-6 py-3 rounded">
              Contact Us
            </button>
          </div>
        </div>
      )}

      {/* ABOUT */}
      {view === "about" && (
        <div className="p-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">About TS Exports</h2>
          <p className="text-gray-300 leading-7">
            We are based in Sialkot, Pakistan — the global hub of sportswear manufacturing.
            We supply premium quality sports kits worldwide with low MOQ, custom designs,
            and export-grade production quality.
          </p>
        </div>
      )}

      {/* SHOP */}
      {view === "shop" && (
        <div className="p-6">

          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full p-3 mb-6 bg-white/10 border border-white/20 rounded"
          />

          {/* PRODUCTS */}
          <div className="grid md:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:scale-105 transition"
              >
                <img
                  src={p.image}
                  className="h-44 w-full object-cover rounded-lg"
                />

                <h2 className="font-bold mt-3 text-lg">{p.name}</h2>

                <p className="text-gray-400 text-sm">{p.category}</p>

                <div className="flex justify-between mt-2 text-sm">
                  <span>MOQ: {p.moq}</span>
                  <span className="font-bold text-green-400">${p.price}</span>
                </div>

                <button className="w-full mt-3 bg-white text-black py-2 rounded">
                  Request Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN */}
      {view === "admin" && admin && (
        <div className="p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

          <input className="w-full p-2 mb-2 border" placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input className="w-full p-2 mb-2 border" placeholder="Price"
            onChange={(e) => setForm({ ...form, price: e.target.value })} />

          <input className="w-full p-2 mb-2 border" placeholder="Category"
            onChange={(e) => setForm({ ...form, category: e.target.value })} />

          <input className="w-full p-2 mb-2 border" placeholder="Image URL"
            onChange={(e) => setForm({ ...form, image: e.target.value })} />

          <input className="w-full p-2 mb-2 border" placeholder="MOQ"
            onChange={(e) => setForm({ ...form, moq: e.target.value })} />

          <button
            onClick={addProduct}
            className="w-full bg-white text-black py-2 mt-2 rounded"
          >
            Add Product
          </button>
        </div>
      )}

    </div>
  );
}