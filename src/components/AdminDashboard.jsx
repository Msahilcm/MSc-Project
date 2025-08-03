import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminProductManagement from './AdminProductManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Products', icon: '📦' },
    { name: 'Categories', icon: '📂' },
    { name: 'Locations', icon: '📍' },
    { name: 'Customers', icon: '👥' }
  ];

  const kpiCards = [
    {
      title: 'ORDER PENDING',
      value: '2',
      icon: '🔄',
      color: '#8B5CF6',
      bgColor: '#F3F4F6'
    },
    {
      title: 'ORDER CANCEL',
      value: '0',
      icon: '❌',
      color: '#EF4444',
      bgColor: '#FEF2F2'
    },
    {
      title: 'ORDER PROCESS',
      value: '5',
      icon: '⚙️',
      color: '#3B82F6',
      bgColor: '#EFF6FF'
    },
    {
      title: 'TODAY INCOME',
      value: '$9568.00',
      icon: '💰',
      color: '#10B981',
      bgColor: '#ECFDF5'
    }
  ];

  const recentOrders = [
    {
      orderId: '109012366687',
      paymentMethod: 'cash',
      orderDate: 'September 14th 2020 4:34:12 pm',
      deliveryDate: '',
      status: 'processing',
      total: '₹1815'
    },
    {
      orderId: '553840047075',
      paymentMethod: 'card',
      orderDate: 'September 14th 2020 3:45:22 pm',
      deliveryDate: '',
      status: 'processing',
      total: '₹430'
    },
    {
      orderId: '109012366688',
      paymentMethod: 'cash',
      orderDate: 'September 14th 2020 2:15:10 pm',
      deliveryDate: '',
      status: 'processing',
      total: '₹920'
    },
    {
      orderId: '553840047076',
      paymentMethod: 'card',
      orderDate: 'September 14th 2020 1:30:45 pm',
      deliveryDate: '',
      status: 'processing',
      total: '₹1560'
    }
  ];

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'Products':
        return <AdminProductManagement />;
      case 'Dashboard':
      default:
        return (
          <>
            <div className="main-header">
              <h1 className="main-title">Dashboard</h1>
              <div className="breadcrumb">Dashboard</div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-section">
              {kpiCards.map((card, index) => (
                <div
                  key={index}
                  className="kpi-card"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <div className="kpi-content">
                    <h3 className="kpi-title" style={{ color: card.color }}>
                      {card.title}
                    </h3>
                    <div className="kpi-value" style={{ color: card.color }}>
                      {card.value}
                    </div>
                  </div>
                  <div className="kpi-icon" style={{ color: card.color }}>
                    {card.icon}
                  </div>
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
                <table className="orders-table">
                  <thead>
                    <tr className="table-header">
                      <th>Order ID</th>
                      <th>Payment Method</th>
                      <th>Order Date</th>
                      <th>Delivery Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="table-row">
                        <td>{order.orderId}</td>
                        <td>{order.paymentMethod}</td>
                        <td>{order.orderDate}</td>
                        <td>{order.deliveryDate}</td>
                        <td>
                          <span className="status-badge processing">
                            {order.status}
                          </span>
                        </td>
                        <td>{order.total}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-btn view-btn" title="View Details">
                              👁️
                            </button>
                            <button className="action-btn edit-btn" title="Edit Order">
                              ✏️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
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
                  onClick={() => setActiveMenuItem(item.name)}
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