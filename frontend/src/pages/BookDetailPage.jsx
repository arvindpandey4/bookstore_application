import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BookDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [book, setBook] = useState(null);
    const [googleBookDetails, setGoogleBookDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        fetchBookDetails();
        fetchReviews();
    }, [id]);

    const fetchBookDetails = async () => {
        try {
            const data = await bookService.getBookById(id);
            if (data.success) {
                setBook(data.data);
                // Fetch additional details from Google Books API
                fetchGoogleBookDetails(data.data.title);
            }
        } catch (error) {
            console.error('Error fetching book:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGoogleBookDetails = async (title) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&maxResults=1`
            );
            if (response.data.items && response.data.items.length > 0) {
                setGoogleBookDetails(response.data.items[0].volumeInfo);
            }
        } catch (error) {
            console.error('Error fetching Google Books details:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/reviews/${id}`);
            if (response.data.success) {
                setReviews(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) return navigate('/login');
        try {
            await bookService.addToCart(book._id, quantity);
            alert('Book added to cart!');
            // Refresh header cart count by reloading
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    const handleAddToWishlist = async () => {
        if (!isAuthenticated) return navigate('/login');
        try {
            await bookService.addToWishlist(book._id);
            alert('Added to wishlist!');
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            alert(error.response?.data?.message || 'Failed to add to wishlist');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return navigate('/login');
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        if (!feedback.trim()) {
            alert('Please write a review');
            return;
        }

        setSubmittingReview(true);
        try {
            const response = await axios.post(
                `http://localhost:5000/api/reviews`,
                {
                    bookId: id,
                    rating,
                    comment: feedback
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                alert('Review submitted successfully!');
                setFeedback('');
                setRating(0);
                fetchReviews();
                fetchBookDetails(); // Refresh to get updated rating
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
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

    if (!book) return <div className="text-center py-5">Book not found</div>;

    return (
        <div className="container py-5">
            <div className="row">
                {/* Left: Images */}
                <div className="col-md-5 mb-4">
                    <div className="d-flex justify-content-center">
                        <div className="d-flex flex-column me-3">
                            <div className="border p-1 mb-2" style={{ width: '50px', cursor: 'pointer' }}>
                                <img
                                    src={book.imageUrl}
                                    className="img-fluid"
                                    alt="thumb"
                                    onError={(e) => e.target.src = 'https://placehold.co/50x70?text=No+Image'}
                                />
                            </div>
                            <div className="border p-1" style={{ width: '50px', cursor: 'pointer' }}>
                                <img
                                    src={book.imageUrl}
                                    className="img-fluid"
                                    alt="thumb"
                                    onError={(e) => e.target.src = 'https://placehold.co/50x70?text=No+Image'}
                                />
                            </div>
                        </div>
                        <div className="border p-4 flex-grow-1 d-flex align-items-center justify-content-center bg-white" style={{ maxWidth: '350px' }}>
                            <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="img-fluid shadow"
                                style={{ maxHeight: '400px', objectFit: 'contain' }}
                                onError={(e) => e.target.src = 'https://placehold.co/300x400?text=No+Image'}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-2 mt-4" style={{ maxWidth: '420px', margin: '0 auto' }}>
                        <button
                            className="btn btn-primary py-2 text-uppercase fw-bold flex-grow-1"
                            style={{ backgroundColor: '#A03037', borderRadius: '0', border: 'none' }}
                            onClick={handleAddToCart}
                        >
                            ADD TO BAG
                        </button>
                        <button
                            className="btn btn-dark py-2 text-uppercase fw-bold flex-grow-1"
                            style={{ borderRadius: '0' }}
                            onClick={handleAddToWishlist}
                        >
                            <i className="bi bi-heart me-2"></i> WISHLIST
                        </button>
                    </div>
                </div>

                {/* Right: Details */}
                <div className="col-md-7">
                    <h2 className="mb-1">{book.title}</h2>
                    <p className="text-muted mb-2">by {book.author}</p>

                    <div className="mb-3">
                        <span className="badge bg-success me-2">{book.averageRating || 4.5} <i className="bi bi-star-fill" style={{ fontSize: '0.7em' }}></i></span>
                        <span className="text-muted">({book.totalReviews || reviews.length} reviews)</span>
                    </div>

                    <h3 className="mb-4">
                        Rs. {book.price}
                        {book.discountPrice && (
                            <span className="text-muted fs-6 ms-2 text-decoration-line-through">Rs. {book.discountPrice}</span>
                        )}
                    </h3>

                    <hr />

                    {/* Book Details from Google Books */}
                    <div className="mb-4">
                        <h6 className="text-muted mb-2">• Book Detail</h6>
                        <p className="small text-dark" style={{ lineHeight: '1.6' }}>
                            {googleBookDetails?.description || book.description}
                        </p>

                        {googleBookDetails && (
                            <div className="mt-3">
                                {googleBookDetails.publishedDate && (
                                    <p className="small mb-1 text-dark"><strong>Published:</strong> {googleBookDetails.publishedDate}</p>
                                )}
                                {googleBookDetails.publisher && (
                                    <p className="small mb-1 text-dark"><strong>Publisher:</strong> {googleBookDetails.publisher}</p>
                                )}
                                {googleBookDetails.pageCount && (
                                    <p className="small mb-1 text-dark"><strong>Pages:</strong> {googleBookDetails.pageCount}</p>
                                )}
                                {googleBookDetails.categories && (
                                    <p className="small mb-1 text-dark"><strong>Categories:</strong> {googleBookDetails.categories.join(', ')}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <hr />



                    {/* Feedback Section */}
                    <div>
                        <h5 className="mb-3">Customer Feedback</h5>

                        {isAuthenticated ? (
                            <form onSubmit={handleSubmitReview} className="bg-light p-3 rounded mb-4">
                                <label className="small mb-2">Overall rating</label>
                                <div className="mb-3" style={{ cursor: 'pointer' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            className={`fs-4 me-1 ${star <= rating ? 'text-warning' : 'text-muted'}`}
                                            onClick={() => setRating(star)}
                                        >
                                            <i className={`fs-4 me-1 bi ${star <= rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
                                        </span>
                                    ))}
                                </div>
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Write your review"
                                    rows="3"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    required
                                ></textarea>
                                <div className="text-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm px-4"
                                        disabled={submittingReview}
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="alert alert-info">
                                Please <a href="/login">login</a> to write a review
                            </div>
                        )}

                        {/* Reviews List */}
                        <div className="mt-4">
                            <h6 className="mb-3">Reviews ({reviews.length})</h6>
                            {reviews.length === 0 ? (
                                <p className="text-muted small">No reviews yet. Be the first to review!</p>
                            ) : (
                                reviews.map((review, index) => (
                                    <div key={review._id || index} className="mb-3 pb-3 border-bottom">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="bg-light rounded-circle text-center pt-1 me-2" style={{ width: '30px', height: '30px', fontSize: '12px' }}>
                                                {review.userId?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span className="fw-bold small">{review.userId?.name || 'Anonymous'}</span>
                                        </div>
                                        <div className="text-warning small mb-1">
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                        <p className="small text-muted mb-1">{review.comment}</p>
                                        <small className="text-muted">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;
