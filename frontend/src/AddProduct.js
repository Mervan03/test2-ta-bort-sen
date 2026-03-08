import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';

function AddProduct() {
  const navigate = useNavigate();
  
  // Tillstånd för att hålla koll på vad vi skriver i formuläret
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Funktionen som körs när vi klickar "Spara flygplan"
  const handleSubmit = (e) => {
    e.preventDefault(); // Hindrar sidan från att laddas om

    // Bygg ihop datan till ett objekt
    const newPlane = {
      title: title,
      description: description,
      price: Number(price), // Ser till att priset blir ett nummer
      imageUrl: imageUrl
    };

    // Skicka till backend
    fetch('http://localhost:5001/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlane)
    })
    .then(response => response.json())
    .then(data => {
      alert("Nytt jaktplan står nu redo i hangaren! 🚀");
      navigate('/'); // Tillbaka till startsidan
    })
    .catch(error => console.error("Kunde inte lägga till flygplan:", error));
  };

  return (
    <Container className="mt-5 mb-5 d-flex justify-content-center">
      <Card className="shadow-lg border-0 w-75">
        <Card.Body className="p-5">
          <Link to="/" className="btn btn-secondary mb-4">⬅ Avbryt och gå tillbaka</Link>
          <h2 className="display-6 fw-bold mb-4">Lagra in nytt jaktplan 🛠️</h2>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Namn / Modell</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="T.ex. JAS 39 Gripen" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Bildlänk (URL)</Form.Label>
              <Form.Control 
                type="url" 
                placeholder="https://exempel.se/bild.jpg" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Pris (kr)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="T.ex. 450000000" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Beskrivning</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Beskriv flygplanets specifikationer..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="success" size="lg" type="submit">
                ➕ Lägg till i butiken
              </Button>
            </div>
          </Form>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddProduct;