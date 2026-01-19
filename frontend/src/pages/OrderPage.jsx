import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';
// Removed missing date-fns import

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getOrders();
            if (data.success) {
                // Backend returns list of orders. Each order has an 'items' array
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;

    return (
        <div className="container py-4">
            {/* Breadcrumb */}
            <div className="mb-4">
                <span className="text-muted">Home / </span>
                <span className="fw-bold">My Order</span>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {orders.length === 0 ? (
                        <div className="text-center py-5 text-muted card border-0 shadow-sm">
                            <h5>No orders placed yet</h5>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order._id} className="card mb-4 border rounded-1 shadow-sm">
                                {/* Only mapping the first item for the main card display as per design, 
                                    or map all if the design supports multiple items per card. 
                                    The design shows 1 item per card block typically, but an order might have multiple.
                                    Let's render a block for each item in the order to match the "list" style */}

                                <div className="card-body p-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className={`row ${index !== 0 ? 'mt-4 pt-4 border-top' : ''}`}>
                                            {/* Product Image */}
                                            <div className="col-md-2 text-center">
                                                <img
                                                    src={item.bookId?.imageUrl || 'https://via.placeholder.com/100x130'}
                                                    alt={item.bookId?.title}
                                                    className="img-fluid"
                                                    style={{ maxHeight: '100px', objectFit: 'contain' }}
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/100x130'}
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="col-md-6">
                                                <h5 className="mb-1">{item.bookId?.title || 'Unknown Title'}</h5>
                                                <p className="text-muted small mb-1">by {item.bookId?.author || 'Unknown Author'}</p>
                                                <div className="d-flex align-items-center mt-3">
                                                    <span className="fw-bold fs-5 me-2">Rs. {item.price || item.bookId?.price}</span>
                                                    {item.bookId?.discountPrice && (
                                                        <span className="text-muted small text-decoration-line-through">
                                                            Rs. {item.bookId?.discountPrice}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-muted small mt-2">
                                                    Quantity: {item.quantity}
                                                </div>
                                            </div>

                                            {/* Order Status */}
                                            <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                                <div className="d-flex align-items-center justify-content-md-end mb-2">
                                                    <span className="rounded-circle bg-success me-2" style={{ width: '8px', height: '8px' }}></span>
                                                    <span className="fw-bold small">Order Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                                                </div>
                                                <div className="small text-muted">Status: <span className="text-success fw-bold text-uppercase">{order.status || 'PLACED'}</span></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
