import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, LogOut, LayoutGrid, Edit2, Trash2, FileText, ExternalLink } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorks();
    }, []);

    const fetchWorks = async () => {
        try {
            const { data, error } = await supabase
                .from('works')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWorks(data || []);
        } catch (error) {
            console.error('Error fetching works:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this work? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('works')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setWorks(works.filter(work => work.id !== id));
        } catch (error) {
            console.error('Error deleting work:', error);
            alert('Failed to delete work');
        }
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-nav">
                <div className="admin-nav-left">
                    <Link to="/admin" className="admin-brand">Admin Dashboard</Link>
                    <span className="admin-badge">Beta</span>
                </div>
                <div className="admin-nav-right">
                    <Link to="/" className="nav-action">
                        <ExternalLink size={16} /> View Site
                    </Link>
                    <button onClick={handleLogout} className="nav-action">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Your Works</h1>
                        <p className="dashboard-subtitle">Manage your portfolio content and case studies</p>
                    </div>
                    <Link to="/admin/work/new" className="add-work-btn">
                        <Plus size={20} /> Add New Work
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : works.length === 0 ? (
                    <div className="empty-state">
                        <LayoutGrid size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <h3>No works found</h3>
                        <p>Create your first portfolio item to get started.</p>
                    </div>
                ) : (
                    <div className="works-grid-admin">
                        {works.map((work) => (
                            <div key={work.id} className="work-card-admin">
                                <img
                                    src={work.preview_image || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={work.heading}
                                    className="admin-card-image"
                                />
                                <div className="admin-card-content">
                                    <div className="admin-card-text">
                                        <h3 className="admin-card-title">{work.heading}</h3>
                                        <p className="admin-card-subtitle">{work.subheading}</p>
                                    </div>

                                    <div className="admin-card-actions">
                                        <Link to={`/admin/work/${work.id}/case-study`} className="action-btn" title="Edit Case Study">
                                            <FileText size={16} /> Content
                                        </Link>
                                        <Link to={`/admin/work/${work.id}`} className="action-btn" title="Edit Details">
                                            <Edit2 size={16} /> Edit
                                        </Link>
                                        <button onClick={() => handleDelete(work.id)} className="action-btn delete" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
