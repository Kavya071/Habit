import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiTarget, 
  FiDollarSign, 
  FiAward, 
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onWidthChange }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Notify parent of width change
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(collapsed ? 80 : 260);
    }
  }, [collapsed, onWidthChange]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/challenges', icon: FiTarget, label: 'Challenges' },
    { path: '/investments', icon: FiDollarSign, label: 'Investments' },
    { path: '/achievements', icon: FiAward, label: 'Achievements' }
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.div
        initial={{ x: 0 }}
        animate={{ 
          width: collapsed ? '80px' : '260px',
          x: 0
        }}
        transition={{ duration: 0.3 }}
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-header">
          {!collapsed && (
            <Link to="/dashboard" className="sidebar-logo">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="logo-text">Stake</span>
                <span className="logo-accent">Your</span>
                <span className="logo-text">Habit</span>
              </motion.div>
            </Link>
          )}
          <button 
            className="sidebar-toggle"
            onClick={handleToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path === '/challenges' && location.pathname.startsWith('/challenge/'));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <Icon className="nav-icon" />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="nav-label"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              <FiUser />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="user-info"
              >
                <div className="user-name">{user?.displayName || 'User'}</div>
                <div className="user-email">{user?.email}</div>
              </motion.div>
            )}
          </div>
          
          <button 
            className="sidebar-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <FiLogOut />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
