import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';

function EditProduct() {
  const { id } = useParams(); // Vilket plan ska vi ändra?
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // 1. Hämta nuvarande data när sidan laddas
  useEffect(() => {
    fetch(`http://localhost:5001/products/${id}`)
      .then(response => response.json())
      .then(data => {
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setImageUrl(data.imageUrl);
      })
      .catch(error => console.error("Fel vid hämtning:", error));
  }, [id]);

  // 2. Skicka de nya ändringarna (PUT)
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPlane = {
      title: title,
      description: description,
      price: Number(price),
      imageUrl: imageUrl
    };

    fetch(`http://localhost:5001/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPlane)
    })
    .then(response => response.json())
    .then(data => {
      alert("Jaktplanet har uppdaterats! 🔧 bytt olja och tankat.");
      navigate(`/product/${id}`); // Kasta tillbaka användaren till detaljsidan
    })
    .catch(error => console.error("Kunde inte uppdatera:", error));
  };

  return (
    <Container className="mt-5 mb-5 d-flex justify-content-center">
      <Card className="shadow-lg border-0 w-75">
        <Card.Body className="p-5">
          <Link to={`/product/${id}`} className="btn btn-secondary mb-4">⬅ Avbryt och gå tillbaka</Link>
          <h2 className="display-6 fw-bold mb-4">Uppdatera jaktplan 🛠️</h2>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Namn / Modell</Form.Label>
              <Form.Control 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Bildlänk (URL)</Form.Label>
              <Form.Control 
                type="url" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Pris (kr)</Form.Label>
              <Form.Control 
                type="number" 
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="warning" size="lg" type="submit" className="fw-bold">
                💾 Spara ändringar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditProduct;