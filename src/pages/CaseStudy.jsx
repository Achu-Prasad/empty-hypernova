import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { ArrowLeft, Save } from 'lucide-react';
import { useCursor } from '../context/CursorContext';
import { useCMS } from '../context/CMSContext';

const CaseStudy = () => {
    // ===== ALL HOOKS MUST BE CALLED HERE AT THE TOP LEVEL =====
    // Never call hooks conditionally or after early returns!

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { setCursorType } = useCursor();
    const { getWork, updateWork, isAdmin } = useCMS();

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Determine navigation paths and edit access
    const backPath = location.state?.from === 'admin' ? '/admin' : '/';
    const backLabel = location.state?.from === 'admin' ? 'Back to Dashboard' : 'Back to Portfolio';
    const hasEditAccess = location.state?.from === 'admin' && isAdmin;

    // Custom upload handler
    const handleUpload = async (file) => {
        const url = URL.createObjectURL(file);
        return url;
    };

    // Initialize editor - ALWAYS called unconditionally
    const editor = useCreateBlockNote({
        uploadFile: handleUpload,
        initialContent: content || undefined,
    });

    // Reset cursor on mount
    useEffect(() => {
        setCursorType('default');
        return () => setCursorType('default');
    }, [setCursorType]);

    // Load content on mount
    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                const work = getWork(id);
                if (work && work.content) {
                    console.log('Loaded content:', work.content);
                    setContent(work.content);
                } else {
                    console.log('No saved content found');
                    setContent(undefined);
                }
            } catch (error) {
                console.error('Error loading content:', error);
                setContent(undefined);
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, [id, getWork]);

    // Auto-save functionality
    const handleSave = async () => {
        if (!editor) return;

        setIsSaving(true);
        try {
            const editorContent = editor.document;
            console.log('Saving content:', editorContent);

            updateWork(id, { content: editorContent });
            setLastSaved(new Date());
            console.log('Case study saved successfully');
        } catch (error) {
            console.error('Save exception:', error);
            alert(`Save error: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // ===== CONDITIONAL RENDERING - AFTER ALL HOOKS =====

    // Show loading state
    if (isLoading) {
        return (
            <div className="case-study-page">
                <div className="case-study-header" style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #eee'
                }}>
                    <div className="header-content">
                        <div className="header-left">
                            <button className="back-button" onClick={() => navigate(backPath)}>
                                <ArrowLeft size={20} />
                                <span>{backLabel}</span>
                            </button>
                        </div>
                        <div className="header-right">
                            <span>Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error if editor failed to initialize
    if (!editor) {
        return (
            <div className="case-study-page">
                <div className="case-study-container">
                    <div className="editor-wrapper">
                        <p>Error: Editor failed to initialize. Please refresh the page.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Main render
    return (
        <div className="case-study-page">
            <div className="case-study-header" style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: '#fff',
                borderBottom: '1px solid #eee'
            }}>
                <div className="header-content">
                    <div className="header-left">
                        <button
                            className="back-button"
                            onClick={() => navigate(backPath)}
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} />
                            <span>{backLabel}</span>
                        </button>
                    </div>
                    <div className="header-right">
                        {!hasEditAccess && <span style={{ marginRight: '1rem', color: '#666', fontSize: '0.9rem' }}>Read Only Mode</span>}
                        {lastSaved && hasEditAccess && (
                            <span className="last-saved">
                                Saved {lastSaved.toLocaleTimeString()}
                            </span>
                        )}
                        {hasEditAccess && (
                            <button
                                className="save-button"
                                onClick={handleSave}
                                disabled={isSaving}
                                aria-label="Save case study"
                            >
                                <Save size={18} />
                                <span>{isSaving ? 'Saving...' : 'Save'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="case-study-container">
                <div className="editor-wrapper">
                    <BlockNoteView
                        editor={editor}
                        theme="light"
                        editable={hasEditAccess}
                    />
                </div>
            </div>
        </div>
    );
};

export default CaseStudy;
