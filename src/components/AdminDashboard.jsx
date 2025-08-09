import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminProductManagement from './AdminProductManagement';
import { productAPI, authAPI, orderAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0
  });
  const [orderStats, setOrderStats] = useState({
    today: { count: 0, total: 0 },
    month: { count: 0, total: 0 },
    year: { count: 0, total: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [reportFilter, setReportFilter] = useState('today'); // 'today' | 'month' | 'year' | 'all'
  const navigate = useNavigate();

  const formatCurrency = (n) => `$${Number(n || 0).toFixed(2)}`;

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get admin token
      const adminToken = localStorage.getItem('adminToken');
      
      // Fetch products to get total count
      const productsResponse = await productAPI.getAllProducts();
      const totalProducts = productsResponse.success ? (productsResponse.data?.length || 0) : 0;
      
      // Fetch orders to get total count and statistics
      let totalOrders = 0;
      let orderStatistics = { today: { count: 0, total: 0, items: 0 }, month: { count: 0, total: 0, items: 0 }, year: { count: 0, total: 0, items: 0 } };
      const computeStatsFromOrders = (orders = []) => {
        const sumReduce = (arr, pred) => arr.filter(pred).reduce((acc, o) => {
          const amt = Number(o.total_amount || 0);
          const qty = Number(o.quantity || 0);
          return { count: acc.count + 1, total: acc.total + amt, items: acc.items + qty };
        }, { count: 0, total: 0, items: 0 });
        const now = new Date();
        const isToday = (d) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
        const isThisMonth = (d) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        const isThisYear = (d) => d.getFullYear() === now.getFullYear();
        const todayStats = sumReduce(orders, o => isToday(new Date(o.created_at)));
        const monthStats = sumReduce(orders, o => isThisMonth(new Date(o.created_at)));
        const yearStats = sumReduce(orders, o => isThisYear(new Date(o.created_at)));
        return { today: todayStats, month: monthStats, year: yearStats };
      };
      if (adminToken) {
        try {
          const ordersResponse = await orderAPI.getAllOrders(adminToken);
          totalOrders = ordersResponse.success ? (ordersResponse.data?.length || 0) : 0;
          
          // Compute statistics from the same dataset to avoid timezone or API mismatch
          if (ordersResponse.success && Array.isArray(ordersResponse.data)) {
            orderStatistics = computeStatsFromOrders(ordersResponse.data);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          totalOrders = 0; // Fallback to 0 if API fails
        }
      }
      
      // Fetch users to get total count
      let totalUsers = 0;
      if (adminToken) {
        try {
          const usersResponse = await authAPI.getAllUsers(adminToken);
          totalUsers = usersResponse.success ? (usersResponse.data?.length || 0) : 0;
        } catch (error) {
          console.error('Error fetching users:', error);
          totalUsers = 0; // Fallback to 0 if API fails
        }
      }
      
      setDashboardData({
        totalProducts,
        totalOrders,
        totalUsers
      });
      setOrderStats(orderStatistics);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to refresh dashboard data (can be called from other components)
  const refreshDashboard = () => {
    fetchDashboardData();
  };

  const [recentOrders, setRecentOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [locationUrl, setLocationUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39697.304644975295!2d-0.12707457832033378!3d51.5484038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761d0069e89807%3A0xe2aeaf20c6d96ba9!2sDISCOUNT%20FURNITURE%20STORE!5e0!3m2!1sen!2suk!4v1754382653712!5m2!1sen!2suk");
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [locationInput, setLocationInput] = useState(locationUrl);

  // Fetch recent orders
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
          const ordersResponse = await orderAPI.getAllOrders(adminToken);
          if (ordersResponse.success && ordersResponse.data) {
            const recent = ordersResponse.data
              .slice(0, 4) // Show only first 4 orders
              .map(order => ({
                id: order.id,
                customerName: order.user_name || 'Unknown',
                productName: order.product_name || 'Unknown Product',
                quantity: order.quantity?.toString() || '1',
                totalAmount: `$${order.total_amount}`,
                status: order.status || 'pending',
                orderDate: new Date(order.created_at).toLocaleDateString()
              }));
            setRecentOrders(recent);
          }
        }
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      }
    };

    fetchRecentOrders();
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        const usersResponse = await authAPI.getAllUsers(adminToken);
        if (usersResponse.success && usersResponse.data) {
          setUsers(usersResponse.data);
        } else {
          setUsers([]);
        }
      }
    } catch (error) {
      setUsers([]);
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api"}/auth/user/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const result = await response.json();
        if (result.success) {
          setUsers(users => users.filter(u => u.id !== userId));
        } else {
          alert(result.message || 'Failed to delete user');
        }
      }
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  // Function to handle KPI card clicks
  const handleKPIClick = (cardTitle) => {
    switch (cardTitle) {
      case 'TOTAL PRODUCTS':
        setActiveMenuItem('Products');
        break;
      case 'TODAY ORDERS':
        setActiveMenuItem('Reports');
        setReportFilter('today');
        fetchAllOrdersForReports();
        break;
      case 'THIS MONTH':
        setActiveMenuItem('Reports');
        setReportFilter('month');
        fetchAllOrdersForReports();
        break;
      case 'THIS YEAR':
        setActiveMenuItem('Reports');
        setReportFilter('year');
        fetchAllOrdersForReports();
        break;
      case 'TOTAL USERS':
        setActiveMenuItem('Customers');
        fetchUsers();
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Products', icon: '📦' },
    { name: 'Locations', icon: '📍' },
    { name: 'Customers', icon: '👥' },
    { name: 'Reports', icon: '🧾' }
  ];

  const handleMenuClick = (itemName) => {
    setActiveMenuItem(itemName);
    if (itemName === 'Customers') {
      fetchUsers();
    }
    if (itemName === 'Reports') {
      fetchAllOrdersForReports();
    }
  };

  const fetchAllOrdersForReports = async () => {
    try {
      setReportsLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) { setAllOrders([]); return; }
      const ordersResponse = await orderAPI.getAllOrders(adminToken);
      if (ordersResponse.success && Array.isArray(ordersResponse.data)) {
        setAllOrders(ordersResponse.data);
      } else {
        setAllOrders([]);
      }
    } catch (e) {
      setAllOrders([]);
    } finally {
      setReportsLoading(false);
    }
  };

  const isInPeriod = (iso, period) => {
    const d = new Date(iso);
    const now = new Date();
    if (period === 'all') return true;
    if (period === 'today') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    }
    if (period === 'month') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    if (period === 'year') {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const kpiCards = [
    {
      title: 'TOTAL PRODUCTS',
      value: loading ? '...' : dashboardData.totalProducts.toString(),
      icon: '📦',
      color: '#3B82F6',
      bgColor: '#EFF6FF'
    },
    {
      title: 'TODAY ORDERS',
      value: loading ? '...' : formatCurrency(orderStats.today.total),
      subtitle: `${orderStats.today.count} orders • ${orderStats.today.items || 0} items`,
      icon: '📅',
      color: '#8B5CF6',
      bgColor: '#F3F4F6'
    },
    {
      title: 'THIS MONTH',
      value: loading ? '...' : formatCurrency(orderStats.month.total),
      subtitle: `${orderStats.month.count} orders • ${orderStats.month.items || 0} items`,
      icon: '📊',
      color: '#10B981',
      bgColor: '#ECFDF5'
    },
    {
      title: 'THIS YEAR',
      value: loading ? '...' : formatCurrency(orderStats.year.total),
      subtitle: `${orderStats.year.count} orders • ${orderStats.year.items || 0} items`,
      icon: '📈',
      color: '#F59E0B',
      bgColor: '#FFFBEB'
    },
    {
      title: 'TOTAL USERS',
      value: loading ? '...' : dashboardData.totalUsers.toString(),
      icon: '👥',
      color: '#10B981',
      bgColor: '#ECFDF5'
    }
  ];

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'Products':
        return <AdminProductManagement />;
      case 'Customers':
        return (
          <div className="users-section">
            <h2 className="users-title">Users</h2>
            {usersLoading ? (
              <div className="loading-message">Loading users...</div>
            ) : users.length > 0 ? (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name} {user.surname}</td>
                      <td>{user.email}</td>
                      <td>
                        <button className="action-btn delete-btn" onClick={() => handleDeleteUser(user.id)} title="Delete User">❌</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-users-message">No users found.</div>
            )}
          </div>
        );
      case 'Locations':
        return (
          <div className="location-section">
            <h2 className="location-title">Store Location</h2>
            <button className="change-location-btn" onClick={() => { setShowLocationForm(true); setLocationInput(locationUrl); }}>
              Change Location
            </button>
            {showLocationForm && (
              <form className="location-form" onSubmit={e => { e.preventDefault(); setLocationUrl(locationInput); setShowLocationForm(false); }}>
                <input
                  type="text"
                  className="location-input"
                  value={locationInput}
                  onChange={e => setLocationInput(e.target.value)}
                  placeholder="Paste Google Maps embed URL here"
                  required
                />
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowLocationForm(false)}>Cancel</button>
              </form>
            )}
            <div className="map-container">
              <iframe
                src={locationUrl}
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '12px', width: '100%', minHeight: '300px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              ></iframe>
            </div>
          </div>
        );
      case 'Dashboard':
      default:
        return (
          <>
            <div className="main-header">
              <div className="header-content">
                <div>
                  <h1 className="main-title">Dashboard</h1>
                  <div className="breadcrumb">Dashboard</div>
                </div>
                <button 
                  className="refresh-btn" 
                  onClick={refreshDashboard}
                  disabled={loading}
                >
                  {loading ? '🔄' : '🔄'} Refresh
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-section">
              {kpiCards.map((card, index) => (
                <div
                  key={index}
                                     className={`kpi-card ${card.title === 'TOTAL PRODUCTS' || card.title === 'TOTAL USERS' || card.title === 'TODAY ORDERS' || card.title === 'THIS MONTH' || card.title === 'THIS YEAR' ? 'clickable' : ''}`}
                  style={{ backgroundColor: card.bgColor }}
                  onClick={() => handleKPIClick(card.title)}
                >
                                     <div className="kpi-content">
                     <h3 className="kpi-title" style={{ color: card.color }}>
                       {card.title}
                     </h3>
                     <div className="kpi-value" style={{ color: card.color }}>
                       {card.value}
                     </div>
                     {card.subtitle && (
                       <div className="kpi-subtitle" style={{ color: card.color, opacity: 0.8 }}>
                         {card.subtitle}
                       </div>
                     )}
                   </div>
                  <div className="kpi-icon" style={{ color: card.color }}>
                    {card.icon}
                  </div>
                                     {(card.title === 'TOTAL PRODUCTS' || card.title === 'TOTAL USERS' || card.title === 'TODAY ORDERS' || card.title === 'THIS MONTH' || card.title === 'THIS YEAR') && (
                     <div className="kpi-hint"></div>
                   )}
                </div>
              ))}
            </div>

            {/* Recent Orders Table */}
            <div className="orders-section">
              <div className="orders-header">
                <h2 className="orders-title">Recent Orders</h2>
                <button className="view-all-btn">View All</button>
              </div>
              
              <div className="table-container">
                {loading ? (
                  <div className="loading-message">Loading orders...</div>
                ) : recentOrders.length > 0 ? (
                  <table className="orders-table">
                    <thead>
                      <tr className="table-header">
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Order Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <tr key={index} className="table-row">
                          <td>#{order.id}</td>
                          <td>{order.customerName}</td>
                          <td>{order.productName}</td>
                          <td>{order.quantity}</td>
                          <td>{order.totalAmount}</td>
                          <td>
                            <span className={`status-badge ${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{order.orderDate}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn view-btn" title="View Details">
                                👁️
                              </button>
                              <button className="action-btn edit-btn" title="Update Status">
                                ✏️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-orders-message">No orders found. Orders will appear here when customers place them!</div>
                )}
              </div>
            </div>
          </>
        );
      case 'Reports':
        return (
          <div className="reports-section">
            <div className="reports-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className="orders-title">Order Reports</h2>
                <div className="breadcrumb">Reports</div>
              </div>
              <div className="report-filters" style={{ display: 'flex', gap: 8 }}>
                <button className={`btn ${reportFilter === 'today' ? 'btn-primary' : ''}`} onClick={() => setReportFilter('today')}>Today</button>
                <button className={`btn ${reportFilter === 'month' ? 'btn-primary' : ''}`} onClick={() => setReportFilter('month')}>This Month</button>
                <button className={`btn ${reportFilter === 'year' ? 'btn-primary' : ''}`} onClick={() => setReportFilter('year')}>This Year</button>
                <button className={`btn ${reportFilter === 'all' ? 'btn-primary' : ''}`} onClick={() => setReportFilter('all')}>All</button>
              </div>
            </div>
            <div className="table-container" style={{ marginTop: 16 }}>
              {reportsLoading ? (
                <div className="loading-message">Loading report...</div>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr className="table-header">
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.filter(o => isInPeriod(o.created_at, reportFilter)).map((o, idx) => (
                      <tr key={idx} className="table-row">
                        <td>#{o.id}</td>
                        <td>{o.user_name || 'Unknown'}</td>
                        <td>{o.product_name || 'Unknown Product'}</td>
                        <td>{o.quantity}</td>
                        <td>${o.total_amount}</td>
                        <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                        <td>{new Date(o.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="admin-dashboard">
        <div className="admin-content">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <h2 className="sidebar-title">Dashboard</h2>
            <nav className="sidebar-nav">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  className={`nav-item ${activeMenuItem === item.name ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.name)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                  <span className="nav-arrow">▶</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="admin-main">
            {renderContent()}
          </main>
        </div>

        {/* Bottom Elements */}
        <div className="bottom-elements">
          <div className="progress-bar"></div>
          <button className="subscribe-btn">
            <span className="youtube-icon">▶</span>
            Subscribe
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 