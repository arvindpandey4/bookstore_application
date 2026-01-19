import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import bookService from '../services/bookService';
import addressService from '../services/addressService';
import orderService from '../services/orderService';

const CartPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { refreshCart } = useCart();
    const [cart, setCart] = useState({ items: [] });
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);

    // Steps: 1 = Cart, 2 = Address, 3 = Summary
    const [step, setStep] = useState(1);

    // UI State for Address
    const [isAddingNew, setIsAddingNew] = useState(false);

    // Editing State (if we make "Edit" functional, for now visual mostly as per request)
    const [editingAddressId, setEditingAddressId] = useState(null);

    // New Address Form State
    const [customerDetails, setCustomerDetails] = useState({
        fullName: user?.name || '',
        mobile: user?.mobile || '',
        address: '',
        city: '',
        state: '',
        type: 'HOME'
    });

    useEffect(() => {
        fetchCart();
        fetchAddresses();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await bookService.getCart();
            if (data.success) {
                setCart(data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            const data = await addressService.getAddresses();
            if (data.success && data.data.length > 0) {
                setAddresses(data.data);
                setSelectedAddress(data.data[0]._id);
            } else {
                setIsAddingNew(true);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const updateQuantity = async (bookId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await bookService.removeFromCart(bookId);
            await bookService.addToCart(bookId, newQuantity);
            fetchCart();
            refreshCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (bookId) => {
        try {
            await bookService.removeFromCart(bookId);
            fetchCart();
            refreshCart();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handlePlaceOrderClick = () => {
        if (cart.items.length > 0) {
            setStep(2);
        }
    };

    const handleAddressContinue = async () => {
        if (isAddingNew) {
            // Logic to add new address
            if (!customerDetails.address || !customerDetails.city || !customerDetails.state || !customerDetails.fullName || !customerDetails.mobile) {
                alert('Please fill in all address details');
                return;
            }
            try {
                const addressData = await addressService.addAddress({
                    name: customerDetails.fullName,
                    phone: customerDetails.mobile,
                    street: customerDetails.address,
                    city: customerDetails.city,
                    state: customerDetails.state,
                    pincode: '000000',
                    type: customerDetails.type
                });
                if (addressData.success) {
                    setAddresses([...addresses, addressData.data]);
                    setSelectedAddress(addressData.data._id);
                    setIsAddingNew(false);
                    setStep(3);
                }
            } catch (error) {
                alert(error.response?.data?.message || 'Error creating address');
            }
        } else {
            if (!selectedAddress) {
                alert('Please select an address');
                return;
            }
            setStep(3);
        }
    };

    const handleFinalCheckout = async () => {
        if (!selectedAddress) {
            alert('No address selected');
            return;
        }
        try {
            const orderData = await orderService.placeOrder(selectedAddress);
            if (orderData.success) {
                navigate('/order-success', { state: { order: orderData.data } });
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error placing order');
        }
    };

    const getLocationString = () => {
        if (addresses.length > 0) {
            // Find selected or first
            const addr = addresses.find(a => a._id === selectedAddress) || addresses[0];
            return `${addr.street.substring(0, 20)}...`;
        }
        return 'Select Location';
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;

    const inputStyle = {
        backgroundColor: '#fff',
        border: '1px solid #E4E4E4',
        borderRadius: '2px', // Sharper corners like production
        height: '45px', // Standard height
        fontSize: '14px',
        color: '#333'
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#555',
        marginBottom: '5px'
    };

    return (
        <div className="container py-5" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {/* Breadcrumb - Slightly larger */}
            <div className="mb-4">
                <span className="text-muted" style={{ fontSize: '14px' }}>Home / </span>
                <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>My cart</span>
            </div>

            {/* Step 1: My Cart */}
            <div className={`border rounded-1 mb-4 bg-white ${step === 1 ? 'border-primary' : ''}`} style={{ borderColor: step === 1 ? '#337AB7' : '#E4E4E4' }}>
                <div className="p-3 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '18px' }}>My cart ({cart.items?.length || 0})</h5>
                    {/* Dynamic Location Header */}
                    <div className="border px-3 py-2 text-muted d-flex align-items-center rounded-1" style={{ minWidth: '220px', justifyContent: 'space-between', fontSize: '13px' }}>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                            <span className="text-dark fw-normal">{getLocationString()}</span>
                        </div>
                        <i className="bi bi-caret-down-fill ms-2 text-muted"></i>
                    </div>
                </div>

                {cart.items?.length === 0 ? (
                    <div className="p-5 text-center text-muted">Your cart is empty</div>
                ) : (
                    <div className="px-3 pb-3">
                        {cart.items.map((item) => (
                            <div key={item.bookId?._id} className="row mb-4 align-items-start">
                                <div className="col-md-2 text-center">
                                    <img
                                        src={item.bookId?.imageUrl}
                                        alt={item.bookId?.title}
                                        className="img-fluid"
                                        style={{ maxHeight: '110px', objectFit: 'contain' }}
                                    />
                                </div>
                                <div className="col-md-6 pt-2">
                                    <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: '16px' }}>{item.bookId?.title}</h6>
                                    <p className="text-muted small mb-1" style={{ fontSize: '12px' }}>by {item.bookId?.author}</p>
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="fw-bold me-2 text-dark" style={{ fontSize: '18px' }}>Rs. {item.bookId?.discountPrice || item.bookId?.price}</span>
                                        {item.bookId?.discountPrice && (
                                            <span className="text-muted text-decoration-line-through small" style={{ fontSize: '12px' }}>
                                                Rs. {item.bookId?.price}
                                            </span>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center mt-3">
                                        <button className="btn btn-light rounded-circle border p-0 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '16px' }} onClick={() => updateQuantity(item.bookId._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                        <span className="mx-3 border px-3 py-1 rounded-1 bg-white small">{item.quantity}</span>
                                        <button className="btn btn-light rounded-circle border p-0 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '16px' }} onClick={() => updateQuantity(item.bookId._id, item.quantity + 1)}>+</button>
                                        <button className="btn btn-link text-dark text-decoration-none small ms-4 fw-bold" style={{ fontSize: '12px' }} onClick={() => removeItem(item.bookId._id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {step === 1 && (
                            <div className="text-end mt-2">
                                <button
                                    className="btn btn-primary px-5 py-2 fw-bold rounded-1"
                                    style={{ backgroundColor: '#337AB7', borderColor: '#337AB7', fontSize: '14px' }}
                                    onClick={handlePlaceOrderClick}
                                >
                                    PLACE ORDER
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Step 2: Customer Details */}
            <div className={`border rounded-1 mb-4 bg-white p-4 ${step === 2 ? '' : ''}`} style={{ opacity: step < 2 ? 0.6 : 1, pointerEvents: step < 2 ? 'none' : 'auto' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '18px' }}>Customer Details</h5>
                    {step >= 2 && !isAddingNew && (
                        <button
                            className="btn btn-outline-danger btn-sm px-3 rounded-1 fw-bold"
                            style={{ color: '#A03037', borderColor: '#A03037', fontSize: '12px', padding: '8px 15px' }}
                            onClick={() => { setIsAddingNew(true); setSelectedAddress(null); }}
                        >
                            Add New Address
                        </button>
                    )}
                </div>

                {step >= 2 && (
                    <>
                        {/* ADDRESS LISTING */}
                        {!isAddingNew && addresses.length > 0 && (
                            <div>
                                {addresses.map((addr, idx) => (
                                    <div key={addr._id} className="mb-4">
                                        {selectedAddress === addr._id ? (
                                            /* EXPANDED VIEW FOR SELECTED ADDRESS */
                                            <div>
                                                {/* Name Row */}
                                                <div className="row g-3 mb-3">
                                                    <div className="col-md-6">
                                                        <label style={labelStyle}>Full Name</label>
                                                        <input type="text" className="form-control" style={inputStyle} value={addr.name} readOnly />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label style={labelStyle}>Mobile Number</label>
                                                        <input type="text" className="form-control" style={inputStyle} value={addr.phone} readOnly />
                                                    </div>
                                                </div>

                                                {/* Radio Type Row with EDIT Button */}
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            checked={true}
                                                            readOnly
                                                            style={{ marginTop: '0.3rem' }} // Align 
                                                        />
                                                        <label className="form-check-label fw-bold text-dark ms-1" style={{ fontSize: '14px' }}>
                                                            {idx + 1}. {addr.type}
                                                        </label>
                                                    </div>
                                                    <span className="ms-4 fw-bold small" style={{ color: '#A03037', cursor: 'pointer', fontSize: '12px' }}>Edit</span>
                                                </div>

                                                {/* Address Textarea */}
                                                <div className="mb-3">
                                                    <label style={labelStyle}>Address</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        style={{ ...inputStyle, height: 'auto', backgroundColor: '#F5F5F5' }} // Keep generic white or slight gray? User image shows slight gray fills for inputs? No, user image shows WHITE inputs
                                                        value={addr.street}
                                                        readOnly
                                                    ></textarea>
                                                </div>

                                                {/* City/State Row */}
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label style={labelStyle}>city/town</label>
                                                        <input type="text" className="form-control" style={{ ...inputStyle, backgroundColor: '#F5F5F5' }} value={addr.city} readOnly />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label style={labelStyle}>State</label>
                                                        <input type="text" className="form-control" style={{ ...inputStyle, backgroundColor: '#F5F5F5' }} value={addr.state} readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* COLLAPSED VIEW FOR UNSELECTED ADDRESSES */
                                            <div>
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="addressSelect"
                                                        checked={selectedAddress === addr._id}
                                                        onChange={() => setSelectedAddress(addr._id)}
                                                    />
                                                    <label className="form-check-label fw-bold text-dark ms-1" style={{ fontSize: '14px' }}>
                                                        {idx + 1}. {addr.type}
                                                    </label>
                                                </div>
                                                <div className="ms-4">
                                                    <label style={{ ...labelStyle, marginBottom: '0' }}>Address</label>
                                                    <p className="text-dark mb-0" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                                                        {addr.street}, {addr.city}, {addr.state}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="text-end mt-4">
                                    <button
                                        className="btn btn-primary px-4 py-2 fw-bold rounded-1"
                                        style={{ backgroundColor: '#337AB7', borderColor: '#337AB7', fontSize: '14px' }}
                                        onClick={handleAddressContinue}
                                    >
                                        CONTINUE
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ADD NEW ADDRESS FORM (Using Same Styles) */}
                        {(isAddingNew || addresses.length === 0) && (
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label style={labelStyle}>Full Name</label>
                                    <input type="text" className="form-control" style={inputStyle} value={customerDetails.fullName} onChange={(e) => setCustomerDetails({ ...customerDetails, fullName: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <label style={labelStyle}>Mobile Number</label>
                                    <input type="text" className="form-control" style={inputStyle} value={customerDetails.mobile} onChange={(e) => setCustomerDetails({ ...customerDetails, mobile: e.target.value })} />
                                </div>

                                <div className="col-12 mt-2">
                                    <label style={labelStyle}>Address</label>
                                    <textarea className="form-control" rows="3" style={{ ...inputStyle, height: 'auto' }} value={customerDetails.address} onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}></textarea>
                                </div>

                                <div className="col-md-6">
                                    <label style={labelStyle}>city/town</label>
                                    <input type="text" className="form-control" style={inputStyle} value={customerDetails.city} onChange={(e) => setCustomerDetails({ ...customerDetails, city: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <label style={labelStyle}>State</label>
                                    <input type="text" className="form-control" style={inputStyle} value={customerDetails.state} onChange={(e) => setCustomerDetails({ ...customerDetails, state: e.target.value })} />
                                </div>

                                {/* Type Selection */}
                                <div className="col-12 mt-3">
                                    <label style={labelStyle}>Type</label>
                                    <div className="d-flex gap-4 mt-1">
                                        {['WORK', 'HOME', 'OTHER'].map((type) => (
                                            <div className="form-check" key={type}>
                                                <input className="form-check-input" type="radio" name="addressType" id={`type${type}`} checked={customerDetails.type === type} onChange={() => setCustomerDetails({ ...customerDetails, type: type })} />
                                                <label className="form-check-label fw-bold text-dark small" htmlFor={`type${type}`}>{type}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-12 text-end mt-4">
                                    {addresses.length > 0 && (
                                        <button
                                            className="btn btn-link text-decoration-none me-3 text-secondary fw-bold small"
                                            onClick={() => setIsAddingNew(false)}
                                        >
                                            CANCEL
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-primary px-4 py-2 fw-bold rounded-1"
                                        style={{ backgroundColor: '#337AB7', borderColor: '#337AB7', fontSize: '14px' }}
                                        onClick={handleAddressContinue}
                                    >
                                        CONTINUE
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Step 3: Order Summary */}
            <div className={`border rounded-1 bg-white p-4 ${step === 3 ? '' : ''}`} style={{ opacity: step < 3 ? 0.6 : 1, pointerEvents: step < 3 ? 'none' : 'auto' }}>
                <h5 className="fw-bold mb-4 text-dark" style={{ fontSize: '18px' }}>Order summary</h5>

                {step === 3 && (
                    <>
                        <div className="row g-4">
                            {cart.items.map((item) => (
                                <div key={item.bookId?._id} className="col-12 mb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="me-4 border p-1" style={{ width: '90px', height: '110px' }}>
                                            <img src={item.bookId?.imageUrl} alt={item.bookId?.title} className="img-fluid w-100 h-100" style={{ objectFit: 'contain' }} />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '18px' }}>{item.bookId?.title}</h5>
                                            <p className="text-muted small mb-2" style={{ fontSize: '12px' }}>by {item.bookId?.author}</p>
                                            <div className="d-flex align-items-center">
                                                <span className="fw-bold fs-5 me-3 text-dark">Rs. {item.bookId?.discountPrice || item.bookId?.price * item.quantity}</span>
                                                {item.bookId?.discountPrice && (
                                                    <span className="text-muted text-decoration-line-through small" style={{ fontSize: '12px' }}>Rs. {item.bookId?.price * item.quantity}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex justify-content-end align-items-center mt-5">
                            <button
                                className="btn btn-primary px-5 py-2 fw-bold text-uppercase rounded-1"
                                style={{ backgroundColor: '#337AB7', borderColor: '#337AB7', fontSize: '14px', width: '180px' }}
                                onClick={handleFinalCheckout}
                            >
                                CHECKOUT
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;
