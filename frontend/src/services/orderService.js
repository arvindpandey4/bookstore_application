import axios from './axios';

const placeOrder = async (addressId) => {
    const response = await axios.post('/api/orders', { addressId });
    return response.data;
};

const getOrders = async () => {
    const response = await axios.get('/api/orders');
    return response.data;
};

const orderService = {
    placeOrder,
    getOrders
};

export default orderService;
