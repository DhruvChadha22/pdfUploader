import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, ListGroup } from 'react-bootstrap';

function App() {
  const [pdfs, setPdfs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    axios.get('/pdfs')
      .then(response => {
        let result = []; 

        for(var i in response.data)
          result.push([i, response.data[i]]);

        setPdfs(result)
      })
      .catch(error => console.error('Error fetching PDFs:', error));
  }, []);

  const handleShowModal = (pdf) => {
    setSelectedPdf(pdf);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleUploadPDF = () => {
      
  }

  return (
    <div className="container mt-5">
      <h1>Uploaded PDFs</h1>
      <ListGroup>
        {pdfs.map(pdf => (
          <ListGroup.Item key={pdf.id} onClick={() => handleShowModal(pdf)}>
            {pdf.name}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>PDF Viewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPdf && (
            <iframe
              src={`/pdfs/${selectedPdf.id}`}
              width="100%"
              height="600px"
              title="PDF Viewer"
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <button onClick={handleUploadPDF}>Upload PDF</button>
    </div>
  );
}

export default App;
