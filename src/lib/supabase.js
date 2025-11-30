import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let supabaseClient;
let supabaseInitError = null;

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url' || supabaseKey === 'your_supabase_publishable_key') {
    console.warn('Supabase credentials are missing! Please check your .env file.');
    supabaseInitError = 'Supabase credentials missing in .env file';
} else {
    try {
        supabaseClient = createClient(supabaseUrl, supabaseKey);
    } catch (error) {
        console.error('Supabase initialization error:', error);
        supabaseInitError = error.message;
    }
}

export const supabase = supabaseClient;
export const initError = supabaseInitError;

/**
 * Upload an image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} bucket - The storage bucket name (default: 'case-study-images')
 * @returns {Promise<{url: string, path: string, error: null} | {url: null, path: null, error: string}>}
 */
export async function uploadImage(file, bucket = 'case-study-images') {
    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return { url: null, path: null, error: error.message };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return {
            url: publicUrl,
            path: filePath,
            error: null
        };
    } catch (error) {
        console.error('Upload exception:', error);
        return {
            url: null,
            path: null,
            error: error.message
        };
    }
}

/**
 * Delete an image from Supabase Storage
 * @param {string} path - The file path in storage
 * @param {string} bucket - The storage bucket name
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export async function deleteImage(path, bucket = 'case-study-images') {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            console.error('Delete error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (error) {
        console.error('Delete exception:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Save case study content to Supabase database
 * @param {string} id - Case study ID
 * @param {object} content - BlockNote content
 * @param {object} metadata - Additional metadata (title, description, etc.)
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export async function saveCaseStudy(id, content, metadata = {}) {
    try {
        const { data, error } = await supabase
            .from('case_studies')
            .upsert({
                id,
                content,
                metadata,
                updated_at: new Date().toISOString()
            })
            .select();

        if (error) {
            console.error('Save error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null, data };
    } catch (error) {
        console.error('Save exception:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Load case study content from Supabase database
 * @param {string} id - Case study ID
 * @returns {Promise<{content: object | null, metadata: object | null, error: string | null}>}
 */
export async function loadCaseStudy(id) {
    try {
        const { data, error } = await supabase
            .from('case_studies')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Load error:', error);
            return { content: null, metadata: null, error: error.message };
        }

        return {
            content: data.content,
            metadata: data.metadata,
            error: null
        };
    } catch (error) {
        console.error('Load exception:', error);
        return { content: null, metadata: null, error: error.message };
    }
}
