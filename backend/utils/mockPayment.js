/**
 * Mock Payment Handler
 * Simulates payment processing without actual payment gateway integration
 */

const processPayment = async (userId, amount, orderDetails) => {
    return new Promise((resolve, reject) => {
        // Simulate payment processing delay
        setTimeout(() => {
            // Mock payment logic - always succeeds for now
            const success = true; // Can be modified to simulate failures

            if (success) {
                console.log('='.repeat(50));
                console.log('PAYMENT SUCCESSFUL');
                console.log('='.repeat(50));
                console.log(`User ID: ${userId}`);
                console.log(`Amount: Rs. ${amount}`);
                console.log(`Order Details:`, JSON.stringify(orderDetails, null, 2));
                console.log('='.repeat(50));

                resolve({
                    success: true,
                    paymentStatus: 'SUCCESS',
                    transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    message: 'Payment processed successfully'
                });
            } else {
                console.log('='.repeat(50));
                console.log('PAYMENT FAILED');
                console.log('='.repeat(50));
                console.log(`User ID: ${userId}`);
                console.log(`Amount: Rs. ${amount}`);
                console.log('='.repeat(50));

                reject({
                    success: false,
                    paymentStatus: 'FAILED',
                    message: 'Payment processing failed'
                });
            }
        }, 1000); // 1 second delay to simulate processing
    });
};

module.exports = { processPayment };
