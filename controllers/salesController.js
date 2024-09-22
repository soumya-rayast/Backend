import Order from '../models/orderModel.js'; 

export const getSalesStats = async (req, res) => {
    try {
      
        const orders = await Order.find(); 

   
        let totalEarnings = 0;
        let totalProductsSold = 0;
        const monthlySales = {};
        
        orders.forEach(order => {
            totalEarnings += order.totalPrice; 
            totalProductsSold += order.products.length;

            const month = new Date(order.createdAt).toLocaleString('default', { month: 'long' }); 
            monthlySales[month] = (monthlySales[month] || 0) + order.totalPrice; 
        });


        const highestSalesMonth = Object.keys(monthlySales).reduce((a, b) => monthlySales[a] > monthlySales[b] ? a : b);

        res.json({
            success: true,
            totalEarnings,
            totalProductsSold,
            highestSalesMonth,
            monthlySales
        });
    } catch (error) {
        console.error('Error fetching sales stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
