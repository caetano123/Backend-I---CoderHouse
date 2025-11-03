import mongoose from "mongoose";
import Product from "../dao/models/product.model.js"; // ajusta ruta si tu modelo está en otra carpeta

const MONGO_URI = "mongodb://127.0.0.1:27017/backend1";

const products = [
  {
    title: "Remera Blanca",
    description: "Remera de algodón blanca, talla M",
    code: "REM-BLA-001",
    price: 1200,
    stock: 25,
    category: "Ropa",
    thumbnails: ["img/remera1.jpg"],
  },
  {
    title: "Pantalón Negro",
    description: "Pantalón de tela, talla L, color negro",
    code: "PAN-NE-002",
    price: 2000,
    stock: 10,
    category: "Ropa",
    thumbnails: ["img/pantalon1.jpg"],
  },
  {
    title: "Zapatos Deportivos",
    description: "Zapatos deportivos para correr, talla 42",
    code: "ZAP-DEP-003",
    price: 3500,
    stock: 20,
    category: "Calzado",
    thumbnails: ["img/zapatos1.jpg"],
  },
  {
    title: "Camisa",
    description: "Camisa de pana, talla M",
    code: "CAM-PA-004",
    price: 2500,
    stock: 15,
    category: "Ropa",
    thumbnails: ["img/camisa1.jpg"],
  },
  {
    title: "Gorra Negra",
    description: "Gorra ajustable color negro con logo bordado",
    code: "GOR-NEG-005",
    price: 900,
    stock: 40,
    category: "Accesorios",
    thumbnails: ["img/gorra1.jpg"],
  },
  {
    title: "Zapatillas Urbanas",
    description: "Zapatillas urbanas unisex, talla 41",
    code: "ZAP-URB-006",
    price: 3800,
    stock: 18,
    category: "Calzado",
    thumbnails: ["img/zapatillas2.jpg"],
  },
  {
    title: "Reloj Digital",
    description: "Reloj digital resistente al agua con cronómetro",
    code: "REL-DIG-007",
    price: 2800,
    stock: 12,
    category: "Tecnología",
    thumbnails: ["img/reloj1.jpg"],
  },
  {
    title: "Auriculares Bluetooth",
    description: "Auriculares inalámbricos con micrófono y estuche de carga",
    code: "AUR-BLU-008",
    price: 3200,
    stock: 30,
    category: "Tecnología",
    thumbnails: ["img/auriculares1.jpg"],
  },
  {
    title: "Mochila Escolar",
    description: "Mochila con compartimiento para laptop de 15 pulgadas",
    code: "MOC-ESC-009",
    price: 2700,
    stock: 22,
    category: "Accesorios",
    thumbnails: ["img/mochila1.jpg"],
  },
  {
    title: "Lámpara LED",
    description: "Lámpara LED recargable con tres niveles de brillo",
    code: "LAM-LED-010",
    price: 1500,
    stock: 35,
    category: "Hogar",
    thumbnails: ["img/lampara1.jpg"],
  },
  {
    title: "Campera de Cuero",
    description: "Campera de cuero sintético color marrón, talla L",
    code: "CAM-CUE-011",
    price: 5800,
    stock: 8,
    category: "Ropa",
    thumbnails: ["img/campera1.jpg"],
  },
  {
    title: "Pantalón Jeans Azul",
    description: "Pantalón de mezclilla azul clásico, talla 32",
    code: "PAN-JEA-012",
    price: 3100,
    stock: 20,
    category: "Ropa",
    thumbnails: ["img/jean1.jpg"],
  },
  {
    title: "Campera Deportiva",
    description: "Campera liviana impermeable con cierre, color gris",
    code: "CAM-DEP-013",
    price: 2900,
    stock: 25,
    category: "Ropa",
    thumbnails: ["img/campera2.jpg"],
  },
  {
    title: "Botines de Fútbol",
    description: "Botines de fútbol con tapones de goma, talla 43",
    code: "BOT-FUT-014",
    price: 4500,
    stock: 15,
    category: "Calzado",
    thumbnails: ["img/botines1.jpg"],
  },
  {
    title: "Cinturón de Cuero",
    description: "Cinturón de cuero negro con hebilla metálica",
    code: "CIN-CUE-015",
    price: 1100,
    stock: 30,
    category: "Accesorios",
    thumbnails: ["img/cinturon1.jpg"],
  },
  {
    title: "Smartwatch Deportivo",
    description: "Reloj inteligente con medición de ritmo cardíaco y pasos",
    code: "SMA-DEP-016",
    price: 6200,
    stock: 12,
    category: "Tecnología",
    thumbnails: ["img/smartwatch1.jpg"],
  },
  {
    title: "Mouse Inalámbrico",
    description: "Mouse inalámbrico ergonómico con receptor USB",
    code: "MOU-INA-017",
    price: 850,
    stock: 40,
    category: "Tecnología",
    thumbnails: ["img/mouse1.jpg"],
  },
  {
    title: "Taza Cerámica",
    description: "Taza blanca de cerámica de 350ml con diseño minimalista",
    code: "TAZ-CER-018",
    price: 600,
    stock: 50,
    category: "Hogar",
    thumbnails: ["img/taza1.jpg"],
  },
  {
    title: "Almohada Viscoelástica",
    description: "Almohada ergonómica con espuma viscoelástica y funda lavable",
    code: "ALM-VIS-019",
    price: 2400,
    stock: 18,
    category: "Hogar",
    thumbnails: ["img/almohada1.jpg"],
  },
  {
    title: "Bolso Deportivo",
    description: "Bolso amplio con compartimientos laterales y correa ajustable",
    code: "BOL-DEP-020",
    price: 3100,
    stock: 16,
    category: "Accesorios",
    thumbnails: ["img/bolso1.jpg"],
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    await Product.deleteMany({});
    console.log("🗑️ Colección 'products' vaciada.");

    const inserted = await Product.insertMany(products);
    console.log(`✅ Insertados ${inserted.length} productos`);

    inserted.forEach((p) => console.log(`→ ${p.title} (${p._id})`));

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error al insertar productos:", err);
  }
}

seedProducts();
