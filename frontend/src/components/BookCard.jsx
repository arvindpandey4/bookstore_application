import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    return (
        <Link to={`/book/${book._id}`} className="text-decoration-none">
            <div className="card h-100 border-0 shadow-sm hover-shadow" style={{ cursor: 'pointer', transition: 'all 0.3s' }}>
                <div className="card-body p-3 d-flex flex-column">
                    {/* Book Image */}
                    <div className="text-center mb-3">
                        <img
                            src={book.imageUrl || 'https://placehold.co/120x180?text=No+Image'}
                            alt={book.title}
                            className="img-fluid"
                            style={{ height: '180px', objectFit: 'contain' }}
                            onError={(e) => e.target.src = 'https://placehold.co/120x180?text=No+Image'}
                        />
                    </div>

                    {/* Book Title */}
                    <h6 className="card-title text-dark mb-1" style={{
                        fontSize: '0.9rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '2.8em'
                    }}>
                        {book.title}
                    </h6>

                    {/* Author */}
                    <p className="text-muted small mb-2" style={{
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        by {book.author}
                    </p>

                    {/* Rating */}
                    <div className="mb-2">
                        <span className="badge bg-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem', width: 'fit-content' }}>
                            {book.averageRating || 4.5} <i className="bi bi-star-fill" style={{ fontSize: '0.6rem' }}></i>
                        </span>
                        <span className="text-muted ms-1" style={{ fontSize: '0.7rem' }}>
                            ({book.totalReviews || 0})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mt-auto">
                        <div className="d-flex align-items-center">
                            <span className="fw-bold text-dark me-2">Rs. {book.price}</span>
                            {book.discountPrice && (
                                <span className="text-muted small text-decoration-line-through" style={{ fontSize: '0.75rem' }}>
                                    Rs. {book.discountPrice}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BookCard;
