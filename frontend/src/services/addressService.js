import axios from './axios';

const getAddresses = async () => {
    const response = await axios.get('/api/addresses');
    return response.data;
};

const addAddress = async (addressData) => {
    const response = await axios.post('/api/addresses', addressData);
    return response.data;
};

const updateAddress = async (id, addressData) => {
    const response = await axios.put(`/api/addresses/${id}`, addressData);
    return response.data;
};

const deleteAddress = async (id) => {
    const response = await axios.delete(`/api/addresses/${id}`);
    return response.data;
};

const addressService = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
};

export default addressService;
