import axios from 'axios';

// Service to handle direct S3 uploads
export const s3Service = {
  uploadFile: async (uploadUrl, file, onProgress) => {
    const response = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return response.status === 200;
  }
};
