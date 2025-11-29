import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, X, Save, Image, Video, Palette, Upload, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const { works, addWork, updateWork, deleteWork, isAdmin, logout } = useCMS();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [currentWork, setCurrentWork] = useState(null);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/login');
        }
    }, [isAdmin, navigate]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        tags: '',
        backgroundType: 'color',
        backgroundValue: '#EBEBE6',
        backgroundBlur: 0,
        previewImage: ''
    });

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            tags: '',
            backgroundType: 'color',
            backgroundValue: '#EBEBE6',
            backgroundBlur: 0,
            previewImage: ''
        });
        setCurrentWork(null);
        setIsEditing(false);
    };

    const handleEdit = (work) => {
        setCurrentWork(work);
        setFormData({
            title: work.title,
            subtitle: work.subtitle,
            tags: work.tags.join(', '),
            backgroundType: work.backgroundType || 'color',
            backgroundValue: work.backgroundValue || '#EBEBE6',
            backgroundBlur: work.backgroundBlur || 0,
            previewImage: work.previewImage
        });
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        // if (window.confirm('Are you sure you want to delete this work?')) {
        deleteWork(id);
        // }
    };

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        // 50MB Limit (Supabase Free Tier simulation)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size exceeds 50MB limit.');
            return;
        }

        // LocalStorage Warning
        if (file.size > 500 * 1024) {
            if (!window.confirm('Warning: This file is larger than 500KB. Storing large files in LocalStorage may exceed the browser quota and cause saving to fail. Do you want to proceed?')) {
                return;
            }
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, [field]: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const workData = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            backgroundBlur: parseInt(formData.backgroundBlur)
        };

        if (currentWork) {
            updateWork(currentWork.id, workData);
        } else {
            addWork(workData);
        }
        resetForm();
    };

    if (!isAdmin) return null;

    return (
        <div style={{ padding: '8rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => { resetForm(); setIsEditing(true); }}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--text-color)',
                            color: 'var(--bg-color)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Plus size={16} /> Add New Work
                    </button>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid var(--text-color)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>

            {/* List of Works */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {works.map(work => (
                    <div key={work.id} style={{
                        padding: '1.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#fff'
                    }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img
                                src={work.previewImage}
                                alt={work.title}
                                style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <div>
                                <h3 style={{ margin: 0 }}>{work.title}</h3>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{work.subtitle}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => navigate(`/case-study/${work.id}`, { state: { from: 'admin' } })}
                                style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                title="Edit Content"
                            >
                                Edit Content
                            </button>
                            <button
                                onClick={() => handleEdit(work)}
                                style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                title="Edit Details"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(work.id)}
                                style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', color: 'red' }}
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Add Modal */}
            {isEditing && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10000
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '2rem',
                        borderRadius: '8px',
                        width: '500px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2>{currentWork ? 'Edit Work' : 'Add New Work'}</h2>
                            <button onClick={resetForm}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>

                            {/* Background Settings */}
                            <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '4px' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Card Background</label>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="bgType"
                                            value="color"
                                            checked={formData.backgroundType === 'color'}
                                            onChange={e => setFormData({ ...formData, backgroundType: e.target.value })}
                                        /> <Palette size={16} /> Color
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="bgType"
                                            value="image"
                                            checked={formData.backgroundType === 'image'}
                                            onChange={e => setFormData({ ...formData, backgroundType: e.target.value })}
                                        /> <Image size={16} /> Image
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="bgType"
                                            value="video"
                                            checked={formData.backgroundType === 'video'}
                                            onChange={e => setFormData({ ...formData, backgroundType: e.target.value })}
                                        /> <Video size={16} /> Video
                                    </label>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                        {formData.backgroundType === 'color' ? 'Color Code (Hex)' : 'URL or Upload'}
                                    </label>

                                    {formData.backgroundType !== 'color' && (
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <input
                                                type="file"
                                                accept={formData.backgroundType === 'image' ? "image/*" : "video/*"}
                                                onChange={(e) => handleFileUpload(e, 'backgroundValue')}
                                                style={{ marginBottom: '0.5rem' }}
                                            />
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>Max size: 50MB. Warning: Large files (&gt;500KB) may fail to save in local storage.</div>
                                        </div>
                                    )}

                                    {formData.backgroundType === 'color' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: formData.backgroundValue,
                                                border: '2px solid #eee',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer'
                                            }}>
                                                <input
                                                    type="color"
                                                    value={formData.backgroundValue}
                                                    onChange={e => setFormData({ ...formData, backgroundValue: e.target.value })}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-50%',
                                                        left: '-50%',
                                                        width: '200%',
                                                        height: '200%',
                                                        opacity: 0,
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    type="text"
                                                    value={formData.backgroundValue}
                                                    onChange={e => setFormData({ ...formData, backgroundValue: e.target.value })}
                                                    placeholder="#000000"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontFamily: 'monospace'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData.backgroundValue}
                                            onChange={e => setFormData({ ...formData, backgroundValue: e.target.value })}
                                            placeholder="Or enter URL manually"
                                            style={{ width: '100%', padding: '0.25rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                        Blur Level: {formData.backgroundBlur}px
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        value={formData.backgroundBlur}
                                        onChange={e => setFormData({ ...formData, backgroundBlur: e.target.value })}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Preview Image (Inner Card)</label>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, 'previewImage')}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={formData.previewImage}
                                    onChange={e => setFormData({ ...formData, previewImage: e.target.value })}
                                    placeholder="Or enter URL manually"
                                    required
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--text-color)',
                                    color: 'var(--bg-color)',
                                    borderRadius: '4px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {currentWork ? 'Update Work' : 'Create Work'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
