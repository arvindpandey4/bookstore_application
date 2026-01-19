import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import bookService from '../services/bookService';

const HomePage = () => {
    const [searchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('relevance');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16; // 4 rows * 4 columns

    useEffect(() => {
        fetchBooks();
    }, [searchParams]);

    useEffect(() => {
        applySorting();
        setCurrentPage(1); // Reset to page 1 on sort/filter change
    }, [books, sortBy]);

    const fetchBooks = async () => {
        try {
            const searchQuery = searchParams.get('search') || '';
            const data = await bookService.getBooks(searchQuery);
            if (data.success) {
                setBooks(data.data);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const applySorting = () => {
        let sorted = [...books];

        switch (sortBy) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            case 'name':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                // relevance - keep original order
                break;
        }

        setFilteredBooks(sorted);
    };

    // Pagination Logic
    const indexOfLastBook = currentPage * itemsPerPage;
    const indexOfFirstBook = indexOfLastBook - itemsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            {/* Header with Sort - Single Line */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 text-muted">
                    Books <span className="small">({filteredBooks.length} items)</span>
                </h5>
                <div className="d-flex align-items-center">
                    <select
                        className="form-select form-select-sm border-0"
                        style={{ width: 'auto', minWidth: '150px' }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="relevance">Sort by relevance</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>
            </div>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
                <div className="text-center py-5">
                    <h5 className="text-muted">No books found</h5>
                    <p className="text-muted">Try adjusting your search query</p>
                </div>
            ) : (
                <>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
                        {currentBooks.map((book) => (
                            <div key={book._id} className="col">
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-2">
                            <button
                                className="btn border rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px', backgroundColor: '#F5F5F5' }}
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                <i className="bi bi-chevron-left text-muted small"></i>
                            </button>

                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                // Simple logic to show all pages if few, or just window around current
                                // For simplicity matching the request "like the image", I'll show all if < 10, or ellipsis
                                // But implementing full ellipsis logic is complex for one-shot. 
                                // I'll display simple list for now, as most demo sets are small. 
                                // If totalPages is huge, I'll limit it.

                                if (totalPages > 10 && Math.abs(currentPage - page) > 2 && page !== 1 && page !== totalPages) {
                                    if (Math.abs(currentPage - page) === 3) return <span key={page} className="text-muted small">...</span>;
                                    return null;
                                }

                                return (
                                    <button
                                        key={page}
                                        onClick={() => paginate(page)}
                                        className={`btn fw-bold rounded-1 d-flex align-items-center justify-content-center ${currentPage === page ? 'text-white' : 'text-dark border-0'}`}
                                        style={{
                                            width: '35px',
                                            height: '30px',
                                            backgroundColor: currentPage === page ? '#A03037' : 'transparent',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button
                                className="btn border rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px', backgroundColor: '#F5F5F5' }}
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <i className="bi bi-chevron-right text-muted small"></i>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;
