import api from './api';

export const documentService = {
  getUploadUrl: async (
    fileName,
    contentType
  ) => {

    const response =
      await api.post(
        '/upload-url',
        {
          fileName,
          contentType
        }
      );

    return response.data;
  },

  getDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  getDocumentById: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  }
};
