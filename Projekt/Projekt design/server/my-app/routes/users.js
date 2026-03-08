var express = require('express');
var router = express.Router();
var db = require('../models');

// HÄMTA VARUKORG
router.get('/:id/getCart', async function(req, res) {
  try {
    const userId = req.params.id;
    
    const userCart = await db.cart.findOne({
      where: { user_id: userId, payed: false },
      include: [{ model: db.product }]
    });

    if (!userCart || !userCart.products) {
      return res.json([]);
    }

    // "Städar upp" datan
    const cleanCart = userCart.products.map(p => ({
      productId: p.id, // <-- NYTT: Vi måste skicka med ID:t så React vet vad som ska tas bort!
      name: p.title,
      price: p.price,
      amount: p.cart_row ? p.cart_row.amount : 1
    }));

    res.json(cleanCart);
  } catch (error) {
    console.error("Backend-fel vid hämtning:", error);
    res.status(500).json({ error: "Kunde inte hämta korg" });
  }
});

// LÄGG TILL I VARUKORG
router.post('/cart/addProduct', async function(req, res) {
  try {
    const { userId, productId, amount } = req.body;

    const [cart] = await db.cart.findOrCreate({
      where: { user_id: userId, payed: false }
    });

    await db.cart_row.create({
      cart_id: cart.id,
      product_id: productId,
      amount: amount || 1
    });

    res.json({ message: "Produkt tillagd!" });
  } catch (error) {
    console.error("Backend-fel vid tillägg:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- NY ROUTE: TA BORT FRÅN VARUKORG (DELETE) ---
router.delete('/cart/removeProduct', async function(req, res) {
  try {
    const { userId, productId } = req.body;

    // Hitta användarens korg först
    const cart = await db.cart.findOne({
      where: { user_id: userId, payed: false }
    });

    if (cart) {
      // Radera kopplingen mellan korgen och produkten i kopplingstabellen
      await db.cart_row.destroy({
        where: {
          cart_id: cart.id,
          product_id: productId
        }
      });
    }

    res.json({ message: "Produkten togs bort från korgen!" });
  } catch (error) {
    console.error("Fel vid borttagning från korg:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;