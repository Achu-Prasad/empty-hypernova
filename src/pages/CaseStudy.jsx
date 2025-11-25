import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { uploadImage, saveCaseStudy, loadCaseStudy } from '../lib/supabase';
import { useCursor } from '../context/CursorContext';

const CaseStudy = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setCursorType } = useCursor();
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [initialContent, setInitialContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Reset cursor on mount
    useEffect(() => {
        setCursorType('default');
        return () => setCursorType('default');
    }, [setCursorType]);

    // Default template content
    const defaultContent = useMemo(() => [
        {
            type: 'heading',
            content: 'New Case Study',
        },
        {
            type: 'paragraph',
            content: 'Start writing your case study here...',
        }
    ], []);

    // Load content on mount
    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                const result = await loadCaseStudy(id);
                if (result.content && !result.error) {
                    console.log('Loaded content:', result.content);
                    setInitialContent(result.content);
                    if (result.metadata?.lastModified) {
                        setLastSaved(new Date(result.metadata.lastModified));
                    }
                } else {
                    console.log('No saved content found, using template');
                    setInitialContent(defaultContent);
                }
            } catch (error) {
                console.error('Error loading content:', error);
                setInitialContent(defaultContent);
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, [id, defaultContent]);

    // Custom upload handler for images
    const handleUpload = async (file) => {
        try {
            console.log('Uploading file:', file.name);
            const result = await uploadImage(file);

            if (result.error) {
                console.error('Upload failed:', result.error);
                alert(`Upload failed: ${result.error}`);
                return '';
            }

            console.log('Upload successful:', result.url);
            return result.url;
        } catch (error) {
            console.error('Upload exception:', error);
            alert(`Upload error: ${error.message}`);
            return '';
        }
    };

    // Initialize BlockNote editor only when content is loaded
    // We use a key on the component to force re-creation if needed, but conditional rendering is safer
    const editor = useCreateBlockNote({
        uploadFile: handleUpload,
        initialContent: initialContent || undefined, // undefined lets it use internal default if null
    }, [initialContent]); // Re-create editor if initialContent changes (though we only render when !isLoading)

    // Auto-save functionality
    const handleSave = async () => {
        if (!editor) return;

        setIsSaving(true);
        try {
            const content = editor.document;
            const result = await saveCaseStudy(id, content, {
                title: 'Case Study ' + id,
                lastModified: new Date().toISOString()
            });

            if (result.error) {
                console.error('Save failed:', result.error);
                alert(`Save failed: ${result.error}`);
            } else {
                setLastSaved(new Date());
                console.log('Case study saved successfully');
            }
        } catch (error) {
            console.error('Save exception:', error);
            alert(`Save error: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="case-study-page">
                <div className="case-study-header">
                    <div className="header-content">
                        <div className="header-left">
                            <button className="back-button" onClick={() => navigate('/')}>
                                <ArrowLeft size={20} />
                                <span>Back to Portfolio</span>
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

    return (
        <div className="case-study-page">
            <div className="case-study-header">
                <div className="header-content">
                    <div className="header-left">
                        <button
                            className="back-button"
                            onClick={() => navigate('/')}
                            aria-label="Go back to home"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Portfolio</span>
                        </button>
                    </div>
                    <div className="header-right">
                        {lastSaved && (
                            <span className="last-saved">
                                Saved {lastSaved.toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            className="save-button"
                            onClick={handleSave}
                            disabled={isSaving}
                            aria-label="Save case study"
                        >
                            <Save size={18} />
                            <span>{isSaving ? 'Saving...' : 'Save'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="case-study-container">
                <div className="editor-wrapper">
                    <BlockNoteView editor={editor} theme="light" />
                </div>
            </div>
        </div>
    );
};

export default CaseStudy;
