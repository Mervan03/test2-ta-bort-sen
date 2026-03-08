import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Modal, ListGroup } from 'react-bootstrap';
import Details from './Details';
import AddProduct from './AddProduct'; 
import EditProduct from './EditProduct'; // <-- Importerar vår redigerings-vy!

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    fetch('http://localhost:5001/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Kunde inte hämta flygplan:", error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-5 fw-bold display-4">Militärshopen 🪖</h1>
      <Row>
        {products.map(product => (
          <Col key={product.id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Img variant="top" src={product.imageUrl} style={{ height: '300px', objectFit: 'cover' }} />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-3 fw-bold">{product.title}</Card.Title>
                <Card.Text className="text-muted text-truncate">{product.description}</Card.Text>
                <h4 className="mt-auto fw-bold">{product.price} kr</h4>
                <div className="d-grid gap-2 mt-3">
                  <Link to={`/product/${product.id}`} className="btn btn-outline-dark">Läs mer</Link>
                  <Button variant="success" onClick={() => addToCart(product.id)}>Lägg i varukorg</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

function App() {
  const [cart, setCart] = useState([]); 
  const [showCart, setShowCart] = useState(false);
  const userId = 1; 

  const fetchCart = () => {
    fetch(`http://localhost:5001/users/${userId}/getCart`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCart(data);
        } else {
          setCart([]);
        }
      })
      .catch(err => {
        console.error("Kunde inte hämta korg:", err);
        setCart([]);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- LÄGG TILL I VARUKORG ---
  const addToCart = (productId) => {
    fetch('http://localhost:5001/users/cart/addProduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, amount: 1 }) 
    })
    .then(() => {
      fetchCart(); 
      alert("Flygplan tillagt i korgen! ✈️");
    })
    .catch(err => console.error("Fel vid tillägg:", err));
  };

  // --- NY FUNKTION: TA BORT FRÅN VARUKORG ---
  const removeFromCart = (productId) => {
    fetch('http://localhost:5001/users/cart/removeProduct', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId }) 
    })
    .then(() => {
      fetchCart(); // Uppdaterar korgen omedelbart så planet försvinner från listan
    })
    .catch(err => console.error("Kunde inte ta bort:", err));
  };

  const totalPrice = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + (item.price * item.amount), 0) 
    : 0;

  return (
    <Router>
      <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center sticky-top shadow">
        <Link to="/" className="text-white text-decoration-none fw-bold fs-4">HANGAR 26</Link>
        
        <div>
          <Link to="/products/new" className="btn btn-outline-warning me-3">
            ➕ Nytt Flygplan (Admin)
          </Link>

          <Button variant="outline-light" onClick={() => setShowCart(true)}>
            Varukorg 🛒 <Badge bg="success">{Array.isArray(cart) ? cart.length : 0}</Badge>
          </Button>
        </div>
      </div>

      <Modal show={showCart} onHide={() => setShowCart(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Din Varukorg 🛒</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!Array.isArray(cart) || cart.length === 0 ? <p>Korgen är tom.</p> : (
            <ListGroup variant="flush">
              {cart.map((item, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">{item.name}</h5>
                    <small className="text-muted">Antal: {item.amount} st</small>
                  </div>
                  
                  {/* NYTT: En div som håller priset och ❌-knappen bredvid varandra */}
                  <div className="d-flex align-items-center">
                    <span className="fw-bold me-3">{item.price * item.amount} kr</span>
                    <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.productId)}>
                      ❌
                    </Button>
                  </div>

                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <hr />
          <h3 className="text-end">Totalt: {totalPrice} kr</h3>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCart(false)}>Fortsätt handla</Button>
          <Button variant="success">Gå till kassan</Button>
        </Modal.Footer>
      </Modal>

      <Routes>
        <Route path="/" element={<ProductList addToCart={addToCart} />} />
        <Route path="/product/:id" element={<Details addToCart={addToCart} />} />
        <Route path="/products/new" element={<AddProduct />} />
        <Route path="/products/:id/edit" element={<EditProduct />} /> 
      </Routes>
    </Router>
  );
}

export default App;