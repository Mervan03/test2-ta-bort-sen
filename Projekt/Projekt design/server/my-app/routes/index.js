var express = require('express');
var router = express.Router();
var db = require('../models');

// Standard-sidan
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Militärshopen API' });
});

// Hämtar ALLA produkter (den vi redan hade)
router.get('/products', async function(req, res) {
  try {
    const products = await db.product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Något gick fel vid hämtning av utrustning" });
  }
});

// VÅR UPPGRADERADE ROUTE: Hämtar EN specifik produkt + DESS BETYG
router.get('/products/:id', async function(req, res) {
  try {
    const product = await db.product.findByPk(req.params.id, {
      // VIKTIGT: Detta hämtar alla betyg (ratings) som är kopplade till produkten
      include: [db.rating] 
    });
    
    if (!product) {
      return res.status(404).json({ message: "Kunde inte hitta flygplanet" });
    }
    
    res.json(product);
  } catch (error) {
    console.error("Fel vid hämtning av produkt:", error);
    res.status(500).json({ message: "Kunde inte hitta produkten" });
  }
});

// VÅR HELT NYA ROUTE: Lägger till ett betyg på ett flygplan i databasen
router.post('/products/:id/rating', async function(req, res) {
  try {
    // Plockar ut värdet på stjärnan vi klickade på (1-5)
    const { ratingValue, userId } = req.body;
    
    await db.rating.create({
      rating: ratingValue, 
      product_id: req.params.id, // Kopplar betyget till rätt flygplan
      user_id: userId || 1 // Vem som röstade (Sven Soldat)
    });
    
    res.json({ message: "Betyg sparat i databasen!" });
  } catch (error) {
    console.error("Fel vid betyg:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// --- ADMIN-FUNKTIONER (CRUD) ---

// SKAPA EN NY PRODUKT (POST)
router.post('/products', async function(req, res) {
  try {
    const { title, description, price, imageUrl } = req.body;
    
    // Skapar ett nytt jaktplan i databasen
    const newProduct = await db.product.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl
    });
    
    res.json({ message: "Nytt jaktplan tillagt i hangaren!", product: newProduct });
  } catch (error) {
    console.error("Fel vid skapande av produkt:", error);
    res.status(500).json({ error: "Kunde inte skapa produkten" });
  }
});

// UPPDATERA EN EXISTERANDE PRODUKT (PUT)
router.put('/products/:id', async function(req, res) {
  try {
    const { title, description, price, imageUrl } = req.body;
    
    // Leta upp flygplanet som ska ändras
    const product = await db.product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Hittade inte flygplanet" });
    }
    
    // Skriv över med de nya värdena
    product.title = title;
    product.description = description;
    product.price = price;
    product.imageUrl = imageUrl;
    
    // Spara ändringarna
    await product.save(); 

    res.json({ message: "Jaktplanet är uppdaterat!", product });
  } catch (error) {
    console.error("Fel vid uppdatering:", error);
    res.status(500).json({ error: "Kunde inte uppdatera produkten" });
  }
});

// TA BORT EN PRODUKT (DELETE)
router.delete('/products/:id', async function(req, res) {
  try {
    const product = await db.product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Hittade inte flygplanet" });
    }
    
    // Raderar produkten helt från databasen
    await product.destroy(); 
    res.json({ message: "Jaktplanet har skrotats (borttaget)!" });
  } catch (error) {
    console.error("Fel vid radering:", error);
    res.status(500).json({ error: "Kunde inte ta bort produkten" });
  }
});

// -------------------------------