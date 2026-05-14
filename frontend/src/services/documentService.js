import api from './api';

/**
 * documentService
 * Handles all document-related API interactions.
 * Maps backend snake_case responses to frontend camelCase fields.
 */
export const documentService = {

  /**
   * Request a presigned S3 upload URL from the backend.
   *
   * @param {string} fileName    - Original file name
   * @param {string} contentType - MIME type of the file (e.g. 'application/pdf')
   * @returns {{ uploadUrl: string, documentId: string }}
   */
  getUploadUrl: async (fileName, contentType) => {
    const response = await api.post('/upload-url', {
      fileName,
      contentType,
    });

    // Map backend snake_case → frontend camelCase
    return {
      uploadUrl:  response.data.upload_url,
      documentId: response.data.object_key,
    };
  },

  /**
   * Fetch the list of all processed documents.
   *
   * @returns {Array} List of document records
   */
  getDocuments: async () => {
    const response = await api.get('/documents');
    return response.data.map(doc => ({
      ...doc,
      id: doc.document_id || doc.id,
      filename: doc.file_name || doc.filename || 'Unknown Document',
      status: doc.status || 'COMPLETED',
      upload_time: doc.upload_time || new Date().toISOString(),
      extracted_fields: doc.extracted_fields || {},
    }));
  },

  /**
   * Fetch a single document's details by its ID.
   *
   * @param {string} id - Document / object key identifier
   * @returns {Object} Document record with extracted data
   */
  getDocumentById: async (id) => {
    const response = await api.get(`/documents/${id}`);
    const doc = response.data;
    return {
      ...doc,
      id: doc.document_id || doc.id,
      filename: doc.file_name || doc.filename || 'Unknown Document',
      status: doc.status || 'COMPLETED',
      upload_time: doc.upload_time || new Date().toISOString(),
      extracted_fields: doc.extracted_fields || {},
    };
  },

  /**
   * Delete a document by its ID from DynamoDB.
   *
   * @param {string} id - Document / object key identifier
   * @returns {Object} Confirmation message
   */
  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },

};
