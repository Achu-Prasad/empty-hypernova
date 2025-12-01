import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, LogOut, LayoutGrid, Edit2, Trash2, FileText, ExternalLink, AlertTriangle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(null); // { id, title }

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

    const confirmDelete = async () => {
        if (!deleteModal) return;

        try {
            const { error } = await supabase
                .from('works')
                .delete()
                .eq('id', deleteModal.id);

            if (error) throw error;
            setWorks(works.filter(work => work.id !== deleteModal.id));
            setDeleteModal(null);
        } catch (error) {
            console.error('Error deleting work:', error);
            alert('Failed to delete work: ' + error.message);
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
                                        <button
                                            onClick={() => setDeleteModal({ id: work.id, title: work.heading })}
                                            className="action-btn delete"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        maxWidth: '500px',
                        width: '90%'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <AlertTriangle size={24} color="#ef4444" />
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Confirm Deletion</h2>
                        </div>
                        <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.6' }}>
                            Are you sure you want to delete <strong>"{deleteModal.title}"</strong>?
                            <br /><br />
                            This will permanently remove the work and all its associated content (case study, images, etc.) from the database.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setDeleteModal(null)}
                                style={{
                                    padding: '10px 20px',
                                    border: '1px solid #ddd',
                                    background: 'white',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    padding: '10px 20px',
                                    border: 'none',
                                    background: '#ef4444',
                                    color: 'white',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
