import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useCart } from '../contexts/CartContext';
import { addressAPI } from '../services/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { getCartItems, getCartTotal, clearCart } = useCart();
  const cartItems = getCartItems();
  const cartTotal = getCartTotal();

  const [address, setAddress] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [card, setCard] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: ''
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    (async () => {
      const res = await addressAPI.list(token);
      if (res.success && Array.isArray(res.data)) {
        setSavedAddresses(res.data);
        const def = res.data.find(a => a.isDefault) || res.data[0];
        if (def) {
          setSelectedAddressId(def.id);
          setAddress({
            fullName: def.fullName || '',
            line1: def.line1 || '',
            line2: def.line2 || '',
            city: def.city || '',
            postalCode: def.postalCode || '',
            country: def.country || '',
            phone: def.phone || ''
          });
        }
      }
    })();
  }, []);

  const handleSelectSaved = (id) => {
    setSelectedAddressId(id);
    const sel = savedAddresses.find(a => a.id === id);
    if (sel) {
      setAddress({
        fullName: sel.fullName || '',
        line1: sel.line1 || '',
        line2: sel.line2 || '',
        city: sel.city || '',
        postalCode: sel.postalCode || '',
        country: sel.country || '',
        phone: sel.phone || ''
      });
    }
  };

  const handleSaveAddress = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in.'); return; }
    const payload = { ...address, isDefault: savedAddresses.length === 0 };
    const res = await addressAPI.create(payload, token);
    if (res.success) {
      const list = await addressAPI.list(token);
      if (list.success) {
        setSavedAddresses(list.data);
      }
      alert('Address saved.');
    } else {
      alert(res.message || 'Failed to save address');
    }
  };
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const shippingAddressText = useMemo(() => {
    const parts = [
      address.fullName,
      address.line1,
      address.line2,
      `${address.city} ${address.postalCode}`.trim(),
      address.country,
      address.phone ? `Phone: ${address.phone}` : ''
    ].filter(Boolean);
    return parts.join(', ');
  }, [address]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please log in to proceed with checkout.');
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      navigate('/');
      return;
    }
    if (!selectedAddressId) {
      alert('Please select an address or add a new one.');
      return;
    }

    try {
      // If card payment, validate card fields (UI-only; not sent to backend)
      if (paymentMethod === 'card') {
        const digitsOnly = (s) => s.replace(/\D/g, '');
        const luhn = (num) => {
          let sum = 0, shouldDouble = false;
          for (let i = num.length - 1; i >= 0; i--) {
            let d = parseInt(num[i], 10);
            if (shouldDouble) {
              d *= 2;
              if (d > 9) d -= 9;
            }
            sum += d;
            shouldDouble = !shouldDouble;
          }
          return sum % 10 === 0;
        };
        const num = digitsOnly(card.number);
        const exp = card.expiry.trim(); // MM/YY or MM/YYYY
        const cvc = digitsOnly(card.cvc);
        const nameOk = (card.name || '').trim().length >= 2;
        const lengthOk = num.length >= 12 && num.length <= 19;
        if (!nameOk) { alert('Please enter the cardholder name.'); return; }
        if (!lengthOk) { alert('Please enter a 12–19 digit card number.'); return; }
        // Optional: enable Luhn check for stricter validation in production
        // if (!luhn(num)) { alert('Invalid card number.'); return; }
        const match = exp.match(/^(\d{2})\/(\d{2}|\d{4})$/);
        if (!match) {
          alert('Expiry must be in MM/YY or MM/YYYY format.');
          return;
        }
        const mmStr = match[1];
        const yyRaw = match[2];
        const yyStr = yyRaw;
        const mm = parseInt(mmStr, 10), yy = parseInt(yyStr, 10);
        if (mm < 1 || mm > 12) { alert('Invalid expiry month.'); return; }
        // naive expiry check against current date (last day of month not considered)
        const now = new Date();
        const curYY = now.getFullYear() % 100;
        const curMM = now.getMonth() + 1;
        const yy2 = yyStr.length === 4 ? (yy % 100) : yy;
        if (yy2 < curYY || (yy2 === curYY && mm < curMM)) { alert('Card has expired.'); return; }
        if (cvc.length !== 3) { alert('Invalid CVC.'); return; }
      }
      setSubmitting(true);
      const token = localStorage.getItem('token');
      for (const item of cartItems) {
        const payload = {
          productId: item.id,
          quantity: item.quantity,
          totalAmount: Number((item.price * item.quantity).toFixed(2)),
          shippingAddress: `${shippingAddressText} | Payment: ${paymentMethod === 'card' ? `CARD ****${(card.number || '').replace(/\D/g,'').slice(-4)}` : paymentMethod.toUpperCase()}`
        };
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Order creation failed');
        }
      }
      // Persist last used card (masked) for profile payment methods view
      if (paymentMethod === 'card') {
        const last4 = (card.number || '').replace(/\D/g, '').slice(-4);
        const cardSummary = {
          brand: 'CARD',
          last4,
          name: (card.name || '').trim(),
          expiry: (card.expiry || '').trim()
        };
        try { localStorage.setItem('lastCard', JSON.stringify(cardSummary)); } catch {}
      }
      clearCart();
      alert('Order placed successfully!');
      navigate('/profile?tab=purchases');
    } catch (error) {
      console.error('Checkout submit error:', error);
      alert('Failed to place the order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <Header />
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-grid">
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2 className="section-title">Shipping Address</h2>
            <div className="address-select">
              <label className="form-label">Select a saved address</label>
              <select className="form-select" value={selectedAddressId || ''} onChange={(e) => handleSelectSaved(Number(e.target.value))}>
                <option value="">-- Choose --</option>
                {savedAddresses.map(a => (
                  <option key={a.id} value={a.id}>
                    {`${a.fullName}, ${a.line1}, ${a.city} ${a.postalCode}`}
                    {a.isDefault ? ' (Default)' : ''}
                  </option>
                ))}
              </select>
              <div className="address-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setNewAddress({ fullName: '', line1: '', line2: '', city: '', postalCode: '', country: '', phone: '' }); setIsAddressModalOpen(true); }}>
                  Add New Address
                </button>
              </div>
            </div>

            <h2 className="section-title">Payment Method</h2>
            <label className="radio-row">
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <span>Cash on Delivery</span>
            </label>
            <label className="radio-row">
              <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              <span>Pay by Card</span>
            </label>

            {paymentMethod === 'card' && (
              <div className="card-form">
                <input
                  className="form-input"
                  placeholder="Cardholder Name"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                />
                <input
                  className="form-input"
                  placeholder="Card Number"
                  inputMode="numeric"
                  maxLength={19}
                  value={card.number}
                  onChange={(e) => {
                    // format as 1234 5678 9012 3456
                    const v = e.target.value.replace(/\D/g, '').slice(0, 19);
                    const parts = v.match(/.{1,4}/g) || [];
                    setCard({ ...card, number: parts.join(' ') });
                  }}
                />
                <div className="form-row">
                  <input
                    className="form-input"
                    placeholder="MM/YY"
                    inputMode="numeric"
                    maxLength={5}
                    value={card.expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
                      setCard({ ...card, expiry: v });
                    }}
                  />
                  <input
                    className="form-input"
                    placeholder="CVC"
                    inputMode="numeric"
                    maxLength={3}
                    value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0,3) })}
                  />
                </div>
                <div className="card-note">Demo only — no real payment is processed. Card data is not sent to the server.</div>
              </div>
            )}

            <button type="submit" className="btn btn-primary place-order-btn" disabled={submitting}>
              {submitting ? 'Placing Order...' : `Place Order ($${cartTotal.toFixed(2)})`}
            </button>
          </form>

          <div className="order-summary">
            <h2 className="section-title">Order Summary</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="order-lines">
                {cartItems.map((item, idx) => (
                  <div key={`${item.id}-${item.selectedColor}-${idx}`} className="order-line">
                    <div>
                      <div className="line-name">{item.name}</div>
                      <div className="line-meta">Qty: {item.quantity}{item.selectedColor ? ` • ${item.selectedColor}` : ''}</div>
                    </div>
                    <div className="line-price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <hr />
                <div className="order-total">
                  <div>Total</div>
                  <div>${cartTotal.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isAddressModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="section-title" style={{ marginTop: 0 }}>Add Address</h2>
            <div className="form-grid">
              <input className="form-input" name="fullName" placeholder="Full name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} required />
              <input className="form-input" name="line1" placeholder="Address line 1" value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} required />
              <input className="form-input" name="line2" placeholder="Address line 2 (optional)" value={newAddress.line2} onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} />
              <div className="form-row">
                <input className="form-input" name="city" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required />
                <input className="form-input" name="postalCode" placeholder="Postal code" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} required />
              </div>
              <input className="form-input" name="country" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} required />
              <input className="form-input" name="phone" placeholder="Phone (optional)" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setIsAddressModalOpen(false)}>Cancel</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (!token) { alert('Please log in.'); return; }
                  if (!newAddress.fullName || !newAddress.line1 || !newAddress.city || !newAddress.postalCode || !newAddress.country) {
                    alert('Please complete the required address fields.');
                    return;
                  }
                  const res = await addressAPI.create({ ...newAddress, isDefault: savedAddresses.length === 0 }, token);
                  if (res.success) {
                    const list = await addressAPI.list(token);
                    if (list.success) {
                      setSavedAddresses(list.data);
                      const sel = list.data.find(a => a.id === (res.data && res.data.id)) || list.data[0];
                      if (sel) {
                        setSelectedAddressId(sel.id);
                        setAddress({
                          fullName: sel.fullName || '',
                          line1: sel.line1 || '',
                          line2: sel.line2 || '',
                          city: sel.city || '',
                          postalCode: sel.postalCode || '',
                          country: sel.country || '',
                          phone: sel.phone || ''
                        });
                      }
                    }
                    setIsAddressModalOpen(false);
                  } else {
                    alert(res.message || 'Failed to save address');
                  }
                }}
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

