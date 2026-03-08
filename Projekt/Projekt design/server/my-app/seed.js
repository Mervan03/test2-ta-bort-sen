const db = require('./models');

async function seedDatabase() {
  try {
    // 1. Skapa testprodukter för er militärshop
    await db.product.bulkCreate([
      {
        title: "Taktisk Ryggsäck 50L",
        description: "Slitstark ryggsäck för fältbruk med MOLLE-system. Vattenavvisande material.",
        price: 1499.00,
        imageUrl: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=600&auto=format&fit=crop" 
      },
      {
        title: "Stridshandskar Kevlar",
        description: "Taktiska handskar med knogskydd och skärskydd. Perfekt för tuffa miljöer.",
        price: 499.00,
        imageUrl: "https://images.unsplash.com/photo-1544377858-5261e4663364?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Kamouflagejacka M90",
        description: "Klassisk svensk fältjacka i M90-mönster. Tål både vind och väta.",
        price: 1299.00,
        imageUrl: "https://images.unsplash.com/photo-1579482186831-2dc04a116892?q=80&w=600&auto=format&fit=crop"
      }
    ]);

    // 2. Skapa en testanvändare (så att varukorgen kan testas senare)
    await db.user.create({
      firstName: "Sven",
      lastName: "Soldat",
      email: "sven@forsvaret.se",
      password: "hemligtlösenord123" 
    });

    console.log("✅ Databasen är nu fylld med grym militärutrustning!");
    process.exit(); // Stänger skriptet när det är klart
  } catch (error) {
    console.error("Fel vid inläggning av data:", error);
  }
}

seedDatabase();