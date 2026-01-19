import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import addressService from '../services/addressService';
import axios from '../services/axios';

const ProfilePage = () => {
    const { user, login } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || ''
    });

    const [newAddress, setNewAddress] = useState({
        name: user?.name || '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        type: 'HOME'
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await addressService.getAddresses();
            if (response.success) {
                setAddresses(response.data);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('/api/auth/profile', profileData);
            if (response.data.success) {
                // Update local storage and context
                const updatedUser = { ...user, ...profileData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                login(updatedUser); // Update context
                alert('Profile updated successfully!');
                setEditingProfile(false);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating profile');
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        // Validation
        if (!newAddress.phone || newAddress.phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }
        if (!newAddress.pincode || newAddress.pincode.length !== 6) {
            alert('Please enter a valid 6-digit pincode');
            return;
        }

        try {
            const response = await addressService.addAddress(newAddress);
            if (response.success) {
                setAddresses([...addresses, response.data]);
                setShowAddForm(false);
                setNewAddress({
                    name: user?.name || '',
                    phone: '',
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                    type: 'HOME'
                });
                alert('Address added successfully!');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding address');
        }
    };

    const handleUpdateAddress = async (id, updatedData) => {
        try {
            const response = await addressService.updateAddress(id, updatedData);
            if (response.success) {
                setAddresses(addresses.map(addr => addr._id === id ? response.data : addr));
                setEditingAddress(null);
                alert('Address updated successfully!');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating address');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        try {
            await addressService.deleteAddress(id);
            setAddresses(addresses.filter(addr => addr._id !== id));
            alert('Address deleted successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting address');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="mb-4">
                <span className="text-muted">Home / </span>
                <span className="fw-bold">Profile</span>
            </div>

            {/* Personal Details Section */}
            <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                    <h5 className="fw-bold mb-0 me-3">Personal Details</h5>
                    <button
                        className="btn btn-link text-danger text-decoration-none fw-bold small p-0"
                        onClick={() => setEditingProfile(!editingProfile)}
                    >
                        {editingProfile ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="row g-4" style={{ maxWidth: '700px' }}>
                    <div className="col-12">
                        <label className="form-label fw-bold small">Full Name</label>
                        <input
                            type="text"
                            className={`form-control ${editingProfile ? '' : 'bg-light'}`}
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            readOnly={!editingProfile}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-bold small">Email Id</label>
                        <input
                            type="email"
                            className="form-control bg-light"
                            value={profileData.email}
                            readOnly
                            title="Email cannot be changed"
                        />
                        <small className="text-muted">Email cannot be changed</small>
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-bold small">Mobile Number</label>
                        <input
                            type="tel"
                            className={`form-control ${editingProfile ? '' : 'bg-light'}`}
                            value={profileData.mobile}
                            onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                            readOnly={!editingProfile}
                            pattern="[0-9]{10}"
                            title="Please enter a valid 10-digit mobile number"
                        />
                    </div>
                    {editingProfile && (
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary me-2">Save Changes</button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setEditingProfile(false);
                                    setProfileData({
                                        name: user?.name || '',
                                        email: user?.email || '',
                                        mobile: user?.mobile || ''
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Address Details Section */}
            <div>
                <div className="d-flex align-items-center justify-content-between mb-4" style={{ maxWidth: '700px' }}>
                    <h5 className="fw-bold mb-0">Address Details</h5>
                    <button
                        className="btn btn-outline-danger btn-sm fw-bold"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? 'Cancel' : 'Add New Address'}
                    </button>
                </div>

                <div style={{ maxWidth: '700px' }}>
                    {/* Add Address Form */}
                    {showAddForm && (
                        <div className="card border mb-4 p-3">
                            <h6 className="fw-bold mb-3">New Address</h6>
                            <form onSubmit={handleAddAddress}>
                                <div className="mb-3">
                                    <label className="form-label small">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        value={newAddress.phone}
                                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                        pattern="[0-9]{10}"
                                        placeholder="10-digit mobile number"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small">Address</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={newAddress.street}
                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="form-label small">City/Town</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label small">State</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label small">Pincode</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newAddress.pincode}
                                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                            pattern="[0-9]{6}"
                                            placeholder="6-digit pincode"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <label className="form-label small">Type</label>
                                        <div className="d-flex gap-4 mt-1">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="newAddressType"
                                                    id="newTypeHome"
                                                    value="HOME"
                                                    checked={newAddress.type === 'HOME'}
                                                    onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                                                />
                                                <label className="form-check-label small" htmlFor="newTypeHome">Home</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="newAddressType"
                                                    id="newTypeWork"
                                                    value="WORK"
                                                    checked={newAddress.type === 'WORK'}
                                                    onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                                                />
                                                <label className="form-check-label small" htmlFor="newTypeWork">Work</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="newAddressType"
                                                    id="newTypeOther"
                                                    value="OTHER"
                                                    checked={newAddress.type === 'OTHER'}
                                                    onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                                                />
                                                <label className="form-check-label small" htmlFor="newTypeOther">Other</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
                            </form>
                        </div>
                    )}

                    {/* Existing Addresses */}
                    {addresses.length === 0 ? (
                        <div className="text-muted text-center py-4 border rounded">No addresses added yet</div>
                    ) : (
                        addresses.map((addr, index) => (
                            <div key={addr._id} className="mb-4">
                                <div className="d-flex align-items-center mb-2">
                                    <h6 className="fw-bold mb-0 me-3">{index + 1}. {addr.type}</h6>
                                    <button
                                        className="btn btn-link text-danger text-decoration-none fw-bold small p-0 me-2"
                                        onClick={() => setEditingAddress(editingAddress === addr._id ? null : addr._id)}
                                    >
                                        {editingAddress === addr._id ? 'Cancel' : 'Edit'}
                                    </button>
                                    <button
                                        className="btn btn-link text-danger text-decoration-none fw-bold small p-0"
                                        onClick={() => handleDeleteAddress(addr._id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                                {editingAddress === addr._id ? (
                                    <EditAddressForm
                                        address={addr}
                                        onSave={(updatedData) => handleUpdateAddress(addr._id, updatedData)}
                                        onCancel={() => setEditingAddress(null)}
                                    />
                                ) : (
                                    <div className="card border-0 bg-light">
                                        <div className="card-body p-3">
                                            <p className="mb-1"><strong>{addr.name}</strong> - {addr.phone}</p>
                                            <p className="mb-1">{addr.street}</p>
                                            <p className="mb-0">{addr.city}, {addr.state} - {addr.pincode}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Edit Address Form Component
const EditAddressForm = ({ address, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        type: address.type
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (formData.phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }
        if (formData.pincode.length !== 6) {
            alert('Please enter a valid 6-digit pincode');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="card border p-3">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label small">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label small">Phone Number</label>
                    <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        pattern="[0-9]{10}"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label small">Address</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        required
                    ></textarea>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label className="form-label small">City/Town</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-6">
                        <label className="form-label small">State</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-6 mt-3">
                        <label className="form-label small">Pincode</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            pattern="[0-9]{6}"
                            required
                        />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label className="form-label small">Type</label>
                        <div className="d-flex gap-4 mt-1">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="editAddressType"
                                    id="editTypeHome"
                                    value="HOME"
                                    checked={formData.type === 'HOME'}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                />
                                <label className="form-check-label small" htmlFor="editTypeHome">Home</label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="editAddressType"
                                    id="editTypeWork"
                                    value="WORK"
                                    checked={formData.type === 'WORK'}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                />
                                <label className="form-check-label small" htmlFor="editTypeWork">Work</label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="editAddressType"
                                    id="editTypeOther"
                                    value="OTHER"
                                    checked={formData.type === 'OTHER'}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                />
                                <label className="form-check-label small" htmlFor="editTypeOther">Other</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <button type="submit" className="btn btn-primary btn-sm me-2">Save</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;
