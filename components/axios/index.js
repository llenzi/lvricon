import axios from 'axios';

const uploadFileRequest = async (formData, progressCallback) => {
    const config = {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: (event) => {
            progressCallback(event)
        },
    }

    const response = await axios.post('/api/uploads', formData, config)

    return response.data
}

export default uploadFileRequest