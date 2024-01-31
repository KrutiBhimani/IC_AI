import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewFile = ({ fileId, accessToken }) => {
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: 'blob', // For binary data
          }
        );

        setFileContent(response.data);
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();
  }, [fileId, accessToken]);

  return (
    <div>
      {fileContent && (
        <iframe
          title="File Viewer"
          src={URL.createObjectURL(fileContent)}
          style={{ width: '100%', height: '500px' }}
        />
      )}
    </div>
  );
};

export default ViewFile;
