import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup } from 'react-bootstrap';
import Rating from '@mui/material/Rating'; 

function Details({ addToCart }) {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [product, setProduct] = useState(null);

  const fetchProduct = () => {
    fetch(`http://localhost:5001/products/${id}`)
      .then(response => {
        if (!response.ok) throw new Error("Produkten finns inte");
        return response.json();
      })
      .then(data => setProduct(data))
      .catch(error => console.error("Fel:", error));
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Funktion för att sätta betyg
  const submitRating = (newValue) => {
    fetch(`http://localhost:5001/products/${id}/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ratingValue: newValue, userId: 1 }) 
    })
    .then(() => {
      fetchProduct(); 
      alert("Tack för din recension! ⭐");
    })
    .catch(err => console.error("Kunde inte spara betyg:", err));
  };

  // Funktion för att skrota planet (DELETE)
  const deleteProduct = () => {
    const confirmDelete = window.confirm("Är du säker på att du vill skrota detta jaktplan permanent?");
    
    if (confirmDelete) {
      fetch(`http://localhost:5001/products/${id}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
        alert("Jaktplanet har skrotats! 💥");
        navigate('/'); // Kasta ut användaren till startsidan
      })
      .catch(error => console.error("Kunde inte ta bort planet:", error));
    }
  };

  if (!product) return <Container className="mt-5 text-center"><h2>Laddar radarn... 📡</h2></Container>;

  const ratingsList = product.ratings || [];
  const averageRating = ratingsList.length > 0 
    ? ratingsList.reduce((sum, r) => sum + r.rating, 0) / ratingsList.length 
    : 0;

  return (
    <Container className="mt-5 mb-5">
      <Link to="/" className="btn btn-secondary mb-3">⬅ Tillbaka till Hangaren</Link>
      <Card className="shadow-lg border-0">
        <Card.Img variant="top" src={product.imageUrl} style={{ height: '500px', objectFit: 'cover' }} />
        <Card.Body className="p-5">
          <Card.Title className="display-4 fw-bold mb-4">{product.title}</Card.Title>
          <Card.Text className="lead fs-4">{product.description}</Card.Text>
          <hr className="my-4" />
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-success fw-bold m-0">{product.price} kr</h2>
            
            {/* HÄR HAR VI LAGT TILL KNAPPARNA BREDVID VARANDRA */}
            <div>
              <Link to={`/products/${id}/edit`} className="btn btn-warning btn-lg me-3 fw-bold">
                Ändra ✏️
              </Link>
              <Button variant="danger" size="lg" className="me-3 fw-bold" onClick={deleteProduct}>
                Skrota 🗑️
              </Button>
              <Button variant="success" size="lg" className="fw-bold" onClick={() => addToCart(product.id)}>
                Lägg till i varukorg
              </Button>
            </div>

          </div>

          {/* BETYGSYSTEMET */}
          <div className="bg-light p-4 rounded mt-4">
            <h4 className="fw-bold mb-3">Radar-recensioner</h4>
            
            <div className="d-flex align-items-center mb-3">
              <span className="me-3 fs-5">Snittbetyg:</span>
              <Rating value={averageRating} precision={0.5} readOnly size="large" />
              <span className="ms-2 text-muted">({ratingsList.length} omdömen)</span>
            </div>

            <hr />

            <div className="mb-4">
              <span className="me-3 fs-5">Sätt ditt eget betyg:</span>
              <Rating 
                name="simple-controlled"
                defaultValue={0}
                size="large"
                onChange={(event, newValue) => {
                  submitRating(newValue);
                }}
              />
            </div>

            <h5 className="mt-4">Alla omdömen:</h5>
            {ratingsList.length === 0 ? <p className="text-muted">Inga betyg ännu. Bli den första!</p> : (
              <ListGroup variant="flush">
                {ratingsList.map((r, index) => (
                  <ListGroup.Item key={index} className="bg-transparent px-0">
                    <Rating value={r.rating} readOnly size="small" />
                    <span className="ms-3 text-muted">Användare {r.user_id}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default Details;