import axios from './axios';

const getBooks = async (keyword = '') => {
    const response = await axios.get(`/api/books?keyword=${keyword}`);
    return response.data;
};

const getBookById = async (id) => {
    const response = await axios.get(`/api/books/${id}`);
    return response.data;
};

const addToCart = async (bookId, quantity = 1) => {
    const response = await axios.post('/api/cart/add', { bookId, quantity });
    return response.data;
};

const getCart = async () => {
    const response = await axios.get('/api/cart');
    return response.data;
};

const removeFromCart = async (bookId) => {
    const response = await axios.delete(`/api/cart/remove/${bookId}`);
    return response.data;
};

const clearCart = async () => {
    const response = await axios.delete('/api/cart/clear');
    return response.data;
};

const addToWishlist = async (bookId) => {
    const response = await axios.post('/api/wishlist/add', { bookId });
    return response.data;
};

const getWishlist = async () => {
    const response = await axios.get('/api/wishlist');
    return response.data;
};

const removeFromWishlist = async (bookId) => {
    const response = await axios.delete(`/api/wishlist/${bookId}`);
    return response.data;
};

const bookService = {
    getBooks,
    getBookById,
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
    addToWishlist,
    getWishlist,
    removeFromWishlist
};

export default bookService;
