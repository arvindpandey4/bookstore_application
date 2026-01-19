import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import successImage from '../assets/images/image 2.png';

const OrderSuccessPage = () => {
    const location = useLocation();
    const order = location.state?.order;

    return (
        <div className="py-5 d-flex align-items-center justify-content-center bg-white">
            <div className="text-center" style={{ maxWidth: '800px', width: '100%' }}>
                {/* Success Image */}
                <div className="mb-2">
                    <img src={successImage} alt="Order Placed Successfully" className="img-fluid" style={{ maxWidth: '400px' }} />
                </div>

                <div className="mb-4">
                    <p className="text-dark mb-1 fs-5">hurray!!! your order is confirmed</p>
                    <p className="text-dark mb-0 fs-5">
                        the order id is #{order?._id?.slice(-6) || '123456'} save the order id for further communication..
                    </p>
                </div>

                {/* Contact Info Table */}
                <div className="container px-0 mb-4">
                    <table className="table table-bordered">
                        <thead>
                            <tr className="bg-light">
                                <th scope="col" className="fw-normal text-muted" style={{ width: '33%' }}>Email us</th>
                                <th scope="col" className="fw-normal text-muted" style={{ width: '33%' }}>Contact us</th>
                                <th scope="col" className="fw-normal text-muted" style={{ width: '33%' }}>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="align-middle">admin@bookstore.com</td>
                                <td className="align-middle">+91 8163475881</td>
                                <td className="align-middle text-start ps-3">
                                    42, 14th Main, 15th Cross, Sector 4, opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore 560034
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <Link to="/" className="btn btn-primary px-5 py-2 text-uppercase fw-bold" style={{ backgroundColor: '#337AB7', border: 'none', borderRadius: '3px' }}>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
