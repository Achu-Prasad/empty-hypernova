import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { ArrowLeft } from 'lucide-react';
import { loadCaseStudy, supabase } from '../lib/supabase';
import { useCursor } from '../context/CursorContext';
import './CaseStudy.css';

const CaseStudy = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setCursorType } = useCursor();
    const [initialContent, setInitialContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [workHeading, setWorkHeading] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);

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
                // Fetch work details for heading
                const { data: work } = await supabase
                    .from('works')
                    .select('heading')
                    .eq('id', id)
                    .single();

                if (work) {
                    setWorkHeading(work.heading);
                }

                // Fetch case study content
                const result = await loadCaseStudy(id);
                if (result.content && !result.error) {
                    setInitialContent(result.content);
                    if (result.metadata?.lastModified) {
                        setLastUpdated(new Date(result.metadata.lastModified));
                    }
                } else {
                    console.log('No saved content found');
                }
            } catch (error) {
                console.error('Error loading content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, [id]);

    // Initialize BlockNote editor in read-only mode
    const editor = useCreateBlockNote({
        initialContent: initialContent || undefined,
    }, [initialContent]);

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

                    <div className="header-center">
                        <h1 className="header-title">
                            {workHeading} <span className="header-subtitle">Case Study</span>
                        </h1>
                    </div>

                    <div className="header-right">
                        {lastUpdated && (
                            <span className="last-updated">
                                Last updated {lastUpdated.toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="case-study-container">
                <div className="editor-wrapper">
                    <BlockNoteView editor={editor} theme="light" editable={false} />
                </div>
            </div>
        </div>
    );
};

export default CaseStudy;
