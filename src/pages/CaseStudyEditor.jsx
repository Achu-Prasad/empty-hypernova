import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { supabase, saveCaseStudy, loadCaseStudy, uploadImage } from '../lib/supabase';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import './CaseStudyEditor.css';

const CaseStudyEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [workTitle, setWorkTitle] = useState('');

    const editor = useCreateBlockNote({
        uploadFile: async (file) => {
            const { url, error } = await uploadImage(file, 'case-study-images');
            if (error) {
                console.error('Upload failed:', error);
                return 'https://via.placeholder.com/150?text=Upload+Error'; // Fallback
            }
            return url;
        }
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // Fetch work details for title
            const { data: work } = await supabase
                .from('works')
                .select('heading')
                .eq('id', id)
                .single();

            if (work) setWorkTitle(work.heading);

            // Fetch existing content
            const { content, error } = await loadCaseStudy(id);
            if (content) {
                editor.replaceBlocks(editor.document, content);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const content = editor.document;
            const { error } = await saveCaseStudy(id, content, {
                lastModified: new Date().toISOString()
            });

            if (error) throw new Error(error);
            alert('Case study saved successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save content');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="case-study-editor">
            <div className="editor-container">
                <div className="editor-header">
                    <div className="editor-title-section">
                        <Link to="/admin" className="back-btn" style={{ marginBottom: '0.5rem' }}>
                            <ArrowLeft size={14} /> Back to Dashboard
                        </Link>
                        <h1 className="editor-title">Editing: {workTitle}</h1>
                    </div>

                    <div className="editor-actions">
                        <button
                            onClick={() => window.open(`/case-study/${id}`, '_blank')}
                            className="preview-btn"
                        >
                            <Eye size={16} /> Preview
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="save-content-btn"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Content
                        </button>
                    </div>
                </div>

                <div className="dark-editor-wrapper">
                    <BlockNoteView editor={editor} theme="light" />
                </div>
            </div>
        </div>
    );
};

export default CaseStudyEditor;
