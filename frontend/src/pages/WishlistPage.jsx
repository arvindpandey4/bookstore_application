import React, { useState, useEffect } from 'react';
import bookService from '../services/bookService';

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const data = await bookService.getWishlist();
            if (data.success) {
                setWishlistItems(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (bookId) => {
        try {
            await bookService.removeFromWishlist(bookId);
            // Optimistic update or refetch
            setWishlistItems(wishlistItems.filter(item => item.bookId._id !== bookId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;

    return (
        <div className="container py-4">
            {/* Breadcrumb */}
            <div className="mb-4">
                <span className="text-muted">Home / </span>
                <span className="fw-bold">My Wishlist</span>
            </div>

            {/* Header Box */}
            <div className="border bg-light p-3 mb-0 rounded-top">
                <h6 className="mb-0 fw-bold">My Wishlist ({wishlistItems.length.toString().padStart(2, '0')})</h6>
            </div>

            {/* List */}
            <div className="border border-top-0 rounded-bottom">
                {wishlistItems.length === 0 ? (
                    <div className="p-5 text-center text-muted">Your wishlist is empty</div>
                ) : (
                    wishlistItems.map((item, index) => (
                        <div key={item.bookId?._id} className={`p-4 ${index !== wishlistItems.length - 1 ? 'border-bottom' : ''}`}>
                            <div className="row">
                                {/* Image */}
                                <div className="col-2 col-md-1">
                                    <img
                                        src={item.bookId?.imageUrl || 'https://via.placeholder.com/100x130'}
                                        alt={item.bookId?.title}
                                        className="img-fluid"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/100x130'}
                                    />
                                </div>

                                {/* Details */}
                                <div className="col-8 col-md-10 ps-md-4">
                                    <h5 className="mb-1">{item.bookId?.title}</h5>
                                    <p className="text-muted small mb-1">by {item.bookId?.author}</p>
                                    <div className="d-flex align-items-center mt-2">
                                        <span className="fw-bold fs-5 me-2">Rs. {item.bookId?.price}</span>
                                        {item.bookId?.discountPrice && (
                                            <span className="text-muted small text-decoration-line-through">
                                                Rs. {item.bookId?.discountPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Delete Action */}
                                <div className="col-2 col-md-1 text-end">
                                    <button
                                        className="btn btn-link text-muted p-0"
                                        onClick={() => removeFromWishlist(item.bookId?._id)}
                                    >
                                        <i className="bi bi-trash text-muted" style={{ fontSize: '1.2rem' }}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
