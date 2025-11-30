import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase, uploadImage } from '../lib/supabase';
import { ArrowLeft, Save, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import './EditWork.css';

const EditWork = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        heading: '',
        subheading: '',
        preview_image: '',
        background_color: '#000000',
        background_image: '',
        background_video: '',
        background_blur: 0,
        tags: []
    });

    useEffect(() => {
        if (!isNew) {
            fetchWork();
        }
    }, [id]);

    const fetchWork = async () => {
        try {
            const { data, error } = await supabase
                .from('works')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData({
                    heading: data.heading || '',
                    subheading: data.subheading || '',
                    preview_image: data.preview_image || '',
                    background_color: data.background_color || '#000000',
                    background_image: data.background_image || '',
                    background_video: data.background_video || '',
                    background_blur: data.background_blur || 0,
                    tags: data.tags || []
                });
            }
        } catch (error) {
            console.error('Error fetching work:', error);
            alert('Failed to load work details');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const { url, error } = await uploadImage(file, 'work-assets');
            if (error) throw new Error(error);

            setFormData(prev => ({ ...prev, [field]: url }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isNew) {
                const { error } = await supabase
                    .from('works')
                    .insert([formData]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('works')
                    .update(formData)
                    .eq('id', id);
                if (error) throw error;
            }
            navigate('/admin');
        } catch (error) {
            console.error('Error saving work:', error);
            alert('Failed to save work');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-work-page">
            <div className="edit-container">
                <div className="edit-header">
                    <Link to="/admin" className="back-btn">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                </div>

                <h1 className="edit-title">{isNew ? 'Create New Work' : 'Edit Work Details'}</h1>

                <form onSubmit={handleSubmit} className="edit-form">
                    {/* Basic Info Section */}
                    <div className="form-section">
                        <div className="section-label">Basic Information</div>
                        <div className="form-group">
                            <label>Heading</label>
                            <input
                                type="text"
                                name="heading"
                                value={formData.heading}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Project Title"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Subheading</label>
                            <textarea
                                name="subheading"
                                value={formData.subheading}
                                onChange={handleInputChange}
                                className="form-textarea"
                                placeholder="Brief description of the project..."
                                required
                            />
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className="form-section">
                        <div className="section-label">Media Assets</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Preview Image (Card)</label>
                                <div className="image-upload-area">
                                    {formData.preview_image ? (
                                        <>
                                            <img src={formData.preview_image} alt="Preview" className="upload-preview" />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => setFormData(prev => ({ ...prev, preview_image: '' }))}
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <label className="upload-placeholder">
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'preview_image')}
                                            />
                                            {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
                                            <span>Click to upload</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Background Image (Hero)</label>
                                <div className="image-upload-area">
                                    {formData.background_image ? (
                                        <>
                                            <img src={formData.background_image} alt="Background" className="upload-preview" />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => setFormData(prev => ({ ...prev, background_image: '' }))}
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <label className="upload-placeholder">
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'background_image')}
                                            />
                                            {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon size={24} />}
                                            <span>Click to upload</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Styling Section */}
                    <div className="form-section">
                        <div className="section-label">Appearance</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Background Color</label>
                                <div className="color-picker-wrapper">
                                    <div
                                        className="color-preview"
                                        style={{ backgroundColor: formData.background_color }}
                                    >
                                        <input
                                            type="color"
                                            name="background_color"
                                            value={formData.background_color}
                                            onChange={handleInputChange}
                                            className="color-input-hidden"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="background_color"
                                        value={formData.background_color}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        style={{ width: '120px' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Background Blur ({formData.background_blur}px)</label>
                                <div className="flex items-center gap-4 h-full">
                                    <input
                                        type="range"
                                        name="background_blur"
                                        min="0"
                                        max="50"
                                        value={formData.background_blur}
                                        onChange={handleInputChange}
                                        className="range-slider"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="form-section">
                        <div className="section-label">Tags</div>
                        <div className="form-group">
                            <label>Project Tags</label>
                            <div className="tags-input-container">
                                <input
                                    type="text"
                                    placeholder="Type a tag and press Enter"
                                    className="form-input"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = e.target.value.trim();
                                            if (val && !formData.tags.includes(val)) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    tags: [...prev.tags, val]
                                                }));
                                                e.target.value = '';
                                            }
                                        }
                                    }}
                                />
                                <div className="tags-list">
                                    {formData.tags.map((tag, index) => (
                                        <span key={index} className="tag-chip">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    tags: prev.tags.filter((_, i) => i !== index)
                                                }))}
                                                className="remove-tag-btn"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="form-actions">
                        <Link to="/admin" className="cancel-btn">
                            Cancel
                        </Link>
                        <button type="submit" className="save-btn" disabled={loading || uploading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditWork;
