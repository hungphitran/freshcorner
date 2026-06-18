const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Admin = require('../models/admin.model');

// Helper function to add totalAmount field to aggregation pipeline
const addTotalAmountField = () => ({
  $addFields: {
    totalAmount: {
      $sum: {
        $map: {
          input: { $ifNull: ['$items', []] },
          as: 'item',
          in: { $multiply: [{ $ifNull: ['$$item.price', 0] }, { $ifNull: ['$$item.quantity', 0] }] }
        }
      }
    }
  }
});

// Helper function to get date range based on period
const getDateRange = (period = 'month', count = 12) => {
  const today = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(today.getTime() - (count * 7 * 24 * 60 * 60 * 1000));
      break;
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth() - count + 1, 1);
      break;
    case 'year':
      startDate = new Date(today.getFullYear() - count + 1, 0, 1);
      break;
    default:
      startDate = new Date(today.getFullYear(), today.getMonth() - count + 1, 1);
  }
  
  return startDate;
};

// Helper function to get period grouping for aggregation
const getPeriodGrouping = (period = 'month') => {
  switch (period) {
    case 'week':
      return {
        year: { $year: '$orderDate' },
        week: { $week: '$orderDate' }
      };
    case 'month':
      return {
        year: { $year: '$orderDate' },
        month: { $month: '$orderDate' }
      };
    case 'year':
      return {
        year: { $year: '$orderDate' }
      };
    default:
      return {
        year: { $year: '$orderDate' },
        month: { $month: '$orderDate' }
      };
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get date ranges
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Get basic counts
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ isActive: true });
    const inactiveProducts = await Product.countDocuments({ isActive: false });
    
    const totalOrders = await Order.countDocuments();
    const contactedOrders = await Order.countDocuments({ status: 'contacted' });
    const notContactedOrders = await Order.countDocuments({ status: 'not contacted' });

    // Get monthly statistics
    const ordersThisMonth = await Order.countDocuments({
      orderDate: { $gte: startOfMonth }
    });
    const ordersLastMonth = await Order.countDocuments({
      orderDate: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    
    const contactedOrdersThisMonth = await Order.countDocuments({
      orderDate: { $gte: startOfMonth },
      status: 'contacted'
    });
    const contactedOrdersLastMonth = await Order.countDocuments({
      orderDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      status: 'contacted'
    });

    // Calculate growth rates
    const orderGrowth = ordersLastMonth > 0 
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100).toFixed(1)
      : 0;
      
    const contactedGrowth = contactedOrdersLastMonth > 0
      ? ((contactedOrdersThisMonth - contactedOrdersLastMonth) / contactedOrdersLastMonth * 100).toFixed(1)
      : 0;

    // Get revenue statistics
    const revenueStats = await Order.aggregate([
      addTotalAmountField(),
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startOfMonth }
        }
      },
      addTotalAmountField(),
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    // Get contacted orders revenue
    const contactedRevenue = await Order.aggregate([
      {
        $match: { status: 'contacted' }
      },
      addTotalAmountField(),
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    // Get most recent products
    const topProducts = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('category', 'name slug themeKey')
      .select('name category packageSize price')
      .lean();

    // Get recent orders with contact status
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(10)
      .select('orderNumber customer status orderDate')
      .lean();

    // Get order contact status distribution
    const orderContactStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get product category distribution
    const productCategoryDistribution = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $group: {
          _id: '$categoryInfo.name',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          products: {
            total: totalProducts || 0,
            active: availableProducts || 0,
            inactive: inactiveProducts || 0
          },
          orders: {
            total: totalOrders || 0,
            contacted: contactedOrders || 0,
            notContacted: notContactedOrders || 0,
            contactRate: totalOrders > 0 ? ((contactedOrders / totalOrders) * 100).toFixed(1) : 0
          }
        },
        growth: {
          ordersThisMonth: ordersThisMonth || 0,
          orderGrowth: parseFloat(orderGrowth) || 0,
          contactedOrdersThisMonth: contactedOrdersThisMonth || 0,
          contactedGrowth: parseFloat(contactedGrowth) || 0
        },
        revenue: {
          total: revenueStats.length > 0 ? revenueStats[0].totalRevenue || 0 : 0,
          average: revenueStats.length > 0 ? revenueStats[0].averageOrderValue || 0 : 0,
          monthly: monthlyRevenue.length > 0 ? monthlyRevenue[0].revenue || 0 : 0,
          contacted: contactedRevenue.length > 0 ? contactedRevenue[0].revenue || 0 : 0,
          contactedCount: contactedRevenue.length > 0 ? contactedRevenue[0].orderCount || 0 : 0
        },
        topProducts: topProducts || [],
        recentOrders: recentOrders || [],
        charts: {
          orderContactStatus: orderContactStatus || [],
          productCategories: productCategoryDistribution || []
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ isActive: true });
    const inactiveProducts = await Product.countDocuments({ isActive: false });

    // Get category distribution
    const categoryStats = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $group: {
          _id: '$categoryInfo.name',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get price range distribution
    const priceRangeStats = await Product.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 200000, 500000, 1000000, 2000000, 999999999999],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          availableProducts,
          inactiveProducts
        },
        categoryStats,
        priceRangeStats
      }
    });
  } catch (error) {
    console.error('Product stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product statistics',
      error: error.message
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    // Get query parameters
    const { period = 'month', count = 12 } = req.query;
    
    // Basic order counts by contact status
    const totalOrders = await Order.countDocuments();
    const contactedOrders = await Order.countDocuments({ status: 'contacted' });
    const notContactedOrders = await Order.countDocuments({ status: 'not contacted' });

    // Get contact status distribution
    const contactStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get time-based trends based on period
    const startDate = getDateRange(period, parseInt(count));
    const periodGrouping = getPeriodGrouping(period);
    
    const timeTrends = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startDate }
        }
      },
      addTotalAmountField(),
      {
        $group: {
          _id: periodGrouping,
          totalOrders: { $sum: 1 },
          contactedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] }
          },
          notContactedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'not contacted'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$totalAmount' },
          contactedRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, '$totalAmount', 0] }
          }
        }
      },
      {
        $addFields: {
          contactRate: {
            $cond: [
              { $gt: ['$totalOrders', 0] },
              { $multiply: [{ $divide: ['$contactedOrders', '$totalOrders'] }, 100] },
              0
            ]
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 }
      }
    ]);

    // Get top customers by order value
    const topCustomers = await Order.aggregate([
      addTotalAmountField(),
      {
        $group: {
          _id: '$customer.email',
          customerName: { $first: '$customer.name' },
          customerPhone: { $first: '$customer.phone' },
          totalOrders: { $sum: 1 },
          contactedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] }
          },
          totalAmount: { $sum: '$totalAmount' },
          lastOrderDate: { $max: '$orderDate' }
        }
      },
      {
        $addFields: {
          contactRate: {
            $cond: [
              { $gt: ['$totalOrders', 0] },
              { $multiply: [{ $divide: ['$contactedOrders', '$totalOrders'] }, 100] },
              0
            ]
          }
        }
      },
      {
        $sort: { totalAmount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get recent orders with contact details
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(20)
      .select('orderNumber customer status orderDate updatedAt')
      .lean();

    // Get orders needing contact (not contacted for more than 24 hours)
    const needContactDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const ordersNeedingContact = await Order.find({
      status: 'not contacted',
      orderDate: { $lte: needContactDate }
    })
    .sort({ orderDate: 1 })
    .limit(10)
    .select('orderNumber customer orderDate')
    .lean();

    // Calculate conversion metrics
    const conversionMetrics = {
      totalOrders,
      contactedOrders,
      notContactedOrders,
      contactRate: totalOrders > 0 ? ((contactedOrders / totalOrders) * 100).toFixed(1) : 0,
      ordersNeedingContact: ordersNeedingContact.length
    };

    res.json({
      success: true,
      data: {
        overview: conversionMetrics,
        contactStatusDistribution,
        timeTrends: {
          period,
          count: parseInt(count),
          data: timeTrends
        },
        topCustomers,
        recentOrders,
        ordersNeedingContact
      }
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
};

// Get blog statistics
// Get contact statistics by time period
const getContactStats = async (req, res) => {
  try {
    // Get query parameters
    const { period = 'month', count = 12, status } = req.query;
    
    // Build match filter
    const matchFilter = {};
    if (status && ['contacted', 'not contacted'].includes(status)) {
      matchFilter.status = status;
    }

    // Get date range
    const startDate = getDateRange(period, parseInt(count));
    matchFilter.orderDate = { $gte: startDate };

    // Get period grouping
    const periodGrouping = getPeriodGrouping(period);

    // Get contact statistics over time
    const contactTrends = await Order.aggregate([
      { $match: matchFilter },
      addTotalAmountField(),
      {
        $group: {
          _id: {
            ...periodGrouping,
            status: '$status'
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month',
            week: '$_id.week'
          },
          contacted: {
            $sum: { $cond: [{ $eq: ['$_id.status', 'contacted'] }, '$count', 0] }
          },
          notContacted: {
            $sum: { $cond: [{ $eq: ['$_id.status', 'not contacted'] }, '$count', 0] }
          },
          contactedRevenue: {
            $sum: { $cond: [{ $eq: ['$_id.status', 'contacted'] }, '$revenue', 0] }
          },
          totalRevenue: { $sum: '$revenue' },
          totalOrders: { $sum: '$count' }
        }
      },
      {
        $addFields: {
          contactRate: {
            $cond: [
              { $gt: ['$totalOrders', 0] },
              { $multiply: [{ $divide: ['$contacted', '$totalOrders'] }, 100] },
              0
            ]
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 }
      }
    ]);

    // Get overall summary
    const overallStats = await Order.aggregate([
      { $match: matchFilter },
      addTotalAmountField(),
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Calculate totals
    const totalStats = overallStats.reduce((acc, stat) => {
      acc.totalOrders += stat.count;
      acc.totalRevenue += stat.revenue;
      
      if (stat._id === 'contacted') {
        acc.contactedOrders = stat.count;
        acc.contactedRevenue = stat.revenue;
        acc.avgContactedOrderValue = stat.avgOrderValue;
      } else {
        acc.notContactedOrders = stat.count;
        acc.notContactedRevenue = stat.revenue;
        acc.avgNotContactedOrderValue = stat.avgOrderValue;
      }
      
      return acc;
    }, {
      totalOrders: 0,
      totalRevenue: 0,
      contactedOrders: 0,
      contactedRevenue: 0,
      notContactedOrders: 0,
      notContactedRevenue: 0,
      avgContactedOrderValue: 0,
      avgNotContactedOrderValue: 0
    });

    // Calculate contact rate
    totalStats.contactRate = totalStats.totalOrders > 0 
      ? ((totalStats.contactedOrders / totalStats.totalOrders) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        period,
        count: parseInt(count),
        status: status || 'all',
        summary: totalStats,
        trends: contactTrends,
        breakdown: overallStats
      }
    });
  } catch (error) {
    console.error('Contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact statistics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getProductStats,
  getOrderStats,
  getContactStats
};
