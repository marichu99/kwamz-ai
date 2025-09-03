import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MpesaModal from './MpesaModal';
import '../styles/form.css';

const DocumentForm = ({ onClose,onSubmitSuccess }) => {
  const [kraPin, setKraPin] = useState('');
  const [taxPayerName, setTaxPayerName] = useState('');
  const [policeClearance, setPoliceClearance] = useState('');
  const [clearedUserName, setClearedUserName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const kraPinFileRef = useRef(null);
  const policeClearanceFileRef = useRef(null);

  useEffect(() => {
    if (taxPayerName && clearedUserName) {
      console.log("The taxpayer name", taxPayerName);
      console.log("The authenticated name", clearedUserName);
      if (taxPayerName !== clearedUserName) {
        alert("The taxpayer name does not match police clearance form details");
        resetForm();
      }
    }
  }, [taxPayerName, clearedUserName]);

  const validatePhone = (phone) => /^\d{10,}$/.test(phone);

  const uploadFile = async (endpoint, file, fieldMap) => {

    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/document${endpoint}`, { method: 'POST', body: formData });
      const result = await res.json();
      if (result.error) {
        alert(result.error);
        return;
      }
      fieldMap.forEach(({ id, key }) => {
        console.log("the key is", key)
        if (key === 'kraPin') setKraPin(result[key]);
        if (key === 'taxPayerName') setTaxPayerName(result[key]);
        if (key === 'refNo') setPoliceClearance(result[key]);
        if (key === 'name') setClearedUserName(result[key]);
        if (key === 'idNo') setIdNumber(result[key]);
      });

    } catch (err) {
      console.error('Upload failed:', err);
      alert('File upload failed.');
    } finally {
      setLoading(false);
    }
  };
const handleSubmitData = async () => {
    // Validation before submission
    if (!kraPin || !policeClearance || !idNumber || !taxPayerName) {
      alert('Please fill in all required fields');
      return;
    }

    const payload = { kraPin, policeClearance, idNumber, taxPayerName };
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/document/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message || result.success || 'Submission complete');
        resetForm();

        // Call the success callback if provided
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }

        // Close the form after successful submission
        if (onClose) {
          onClose();
        }
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setKraPin('');
    setPoliceClearance('');
    setTaxPayerName('');
    setClearedUserName('');
    setIdNumber('');
    setMessage('');
    resetFileInput(policeClearanceFileRef);
    resetFileInput(kraPinFileRef);
  };

  const resetFileInput = (ref) => {
    if (ref.current) ref.current.value = '';
  };

  const handleSubmit = async (response) => {
    console.log("The response is", response);
    var checkout_id = response.CheckoutRequestID;
    const token = localStorage.getItem('token');
    setLoading(true);
    // Step 2: Poll backend until status changes
    let status = "pending";
    while (status === "pending") {
      // const resp = await fetch(`${process.env.REACT_APP_API_URL}/mpesa/transaction-status/${checkout_id}`);
      // const resp = await axios.get(`${process.env.REACT_APP_API_URL}/mpesa/transaction-status/${checkout_id}`);
      const resp = await axios.get(
        `${process.env.REACT_APP_API_URL}/mpesa/transaction-status/${checkout_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      // const data = await resp.json();
      var result_code = 7777;
      var messageError = ""
      if (resp.data.length > 0) {
        result_code = resp.data[0].result_code
        if (result_code === 0) {
          status = "success"
        } if (result_code === 2001) {
          status = "failure"
          messageError = "Wrong Mpesa Credentials passed"
        } if (result_code === 1032) {
          status = "failure"
          messageError = "Mpesa Push Dissmissed / Cancelled By User"
        }
        console.log("The result code is ", result_code)

      }

      if (status === "pending") {
        await new Promise(r => setTimeout(r, 5000)); // wait 5s before retry
      }
    }

    // Step 3: Handle success/failure
    if (status === "success") {
      await handleSubmitData();
    } else {
      alert(messageError);
    }
    setLoading(false);
    setShowModal(false);
  };

  return (
    <div className="form-container">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <h2>Submit Document Details</h2>
      {message && <p className="success">{message}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>KRA PIN</label>
          <input type="text" value={kraPin} onChange={(e) => setKraPin(e.target.value)} />
          <input
            type="file"
            accept=".pdf"
            ref={kraPinFileRef}
            onChange={(e) =>
              uploadFile('/extract_kra_pin', e.target.files[0], [{ id: 'kraPin', key: 'kraPin' }, { id: 'taxPayerName', key: 'taxPayerName' }])
            }
          />
        </div>

        <div className="form-group">
          <label>Police Clearance</label>
          <input type="text" value={policeClearance} onChange={(e) => setPoliceClearance(e.target.value)} />
          <input
            type="file"
            accept=".pdf"
            ref={policeClearanceFileRef}
            onChange={(e) =>
              uploadFile('/extract_police_clearance', e.target.files[0], [
                { id: 'policeClearance', key: 'refNo' },
                { id: 'name', key: 'name' },
                { id: 'idNumber', key: 'idNo' },
              ])
            }
          />
        </div>

        <div className="form-group">
          <label>ID Number</label>
          <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
        </div>

        <div className="modal-buttons">
          <button type="button" onClick={() => setShowModal(true)}>Submit</button>
          <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <MpesaModal
              onClose={() => setShowModal(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentForm;
