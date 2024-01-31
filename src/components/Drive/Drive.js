import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFolderPlus } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { FaCaretRight } from "react-icons/fa";
import { BsGrid } from "react-icons/bs";
import { BsFillGridFill } from "react-icons/bs";
import { FaRectangleList } from "react-icons/fa6";
import { FaRegRectangleList } from "react-icons/fa6";
import Directory from './Directory';
import ViewFile from './ViewFile';
import GridView from './GridView';
import ListView from './ListView';
import '../../styles.css';

const Drive = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [files, setFiles] = useState([]);
  const [sidebarFiles, setsidebarFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [folderHistory, setFolderHistory] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFileId, setSelectedFileId] = useState(null);

  const handleView = (fileId, folderName) => {
    setSelectedFileId(fileId);
    setFolderHistory((prevHistory) => {
      const newHistory = [...prevHistory, folderName];
      return newHistory;
    });

  };

  const handlePreviewClose = () => {
    setSelectedFileId(null);
    setFolderHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authorizationCode = urlParams.get('code');

      if (authorizationCode) {
        console.log('Authorization code:', authorizationCode);
        await exchangeTokenOnClient(authorizationCode);
      } else {
        const authorizationUrl =
          'https://accounts.google.com/o/oauth2/v2/auth' +
          '?response_type=code' +
          '&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdrive' +
          '&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive' +
          '&client_id=615234662848-7bu97lbhgvk7j8ca4jn2e68bhcm1igun.apps.googleusercontent.com';

        window.location.href = authorizationUrl;
        setNavigationHistory([]);
      }
    };

    fetchData();
  }, []);

  const exchangeTokenOnClient = async (authorizationCode) => {
    setLoading(true);
    try {
      const tokenUrl = 'https://accounts.google.com/o/oauth2/token';
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: authorizationCode,
          client_id: '615234662848-7bu97lbhgvk7j8ca4jn2e68bhcm1igun.apps.googleusercontent.com',
          client_secret: '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',
          redirect_uri: 'http://localhost:3000/drive',
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();
      console.log('Token data:', tokenData);

      setAccessToken(tokenData.access_token);

      const homepageFilesResponse = await axios.get('https://www.googleapis.com/drive/v3/files', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        params: {
          // q: "'root' in parents",
          q: "'root' in parents and (mimeType='application/pdf' or mimeType='application/vnd.google-apps.folder')",  // get only pdf
        },
      });

      console.log(homepageFilesResponse.data.files);
      setFiles(homepageFilesResponse.data.files);
      setsidebarFiles(homepageFilesResponse.data.files);
    } catch (error) {
      console.error('Error during token exchange:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (fileId, newName) => {
    try {
      const metadataResponse = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const currentFile = metadataResponse.data;
      const fileName = currentFile.name || '';
      const lastDotIndex = fileName.lastIndexOf('.');
      const fileExtension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';

      const response = await axios.patch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        { name: `${newName}${fileExtension}` },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedFile = response.data;

      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === updatedFile.id
            ? { ...file, name: updatedFile.name, fileExtension }
            : file
        )
      );
      console.log('File renamed successfully:', updatedFile);
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const metadataResponse = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'arraybuffer',
        }
      );
      const fileName = response.headers['content-disposition']?.split('filename=')[1] || metadataResponse.data.name || `downloaded-file.${metadataResponse.data.fileExtension || 'unknown'}`;
      const mimeType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: mimeType });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error.response ? error.response.data : error.message);
    }
  };

  const handleFolderClick = async (folderId, folderName) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/drive/v3/files`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: `'${folderId}' in parents and (mimeType='application/pdf' or mimeType='application/vnd.google-apps.folder')`,
        },
      });
      const folderContent = response.data.files;
      setNavigationHistory((prevHistory) => {
        const newHistory = [...prevHistory, folderId];
        return newHistory;
      });
      setFolderHistory((prevHistory) => {
        const newHistory = [...prevHistory, folderName];
        return newHistory;
      });

      setFiles(folderContent);
    } catch (error) {
      console.error('Error fetching folder content:', error);
    }
  };

  const handleNavigateBack = async () => {
    const previousFolder = navigationHistory[navigationHistory.length - 2];
    let data = `'${previousFolder}' in parents and (mimeType='application/pdf' or mimeType='application/vnd.google-apps.folder')`;
    if (navigationHistory.length <= 1) {
      data = `'root' in parents and (mimeType='application/pdf' or mimeType='application/vnd.google-apps.folder')`;
    }
    try {
      const response = await axios.get(`https://www.googleapis.com/drive/v3/files`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: data,
        },
      });

      const folderContent = response.data.files;
      setFiles(folderContent);
      setNavigationHistory((prevHistory) => prevHistory.slice(0, -1));
      setFolderHistory((prevHistory) => prevHistory.slice(0, -1));
    } catch (error) {
      console.error('Error navigating back:', error);
    }
  };

  const createNewFolder = async (folderName) => {
    try {
      const parentFolderId = navigationHistory.length > 0 ? navigationHistory[navigationHistory.length - 1] : 'root';
      const response = await axios.post(
        'https://www.googleapis.com/drive/v3/files',
        {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentFolderId],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newFolder = response.data;
      setFiles((prevFiles) => [newFolder, ...prevFiles]);
      console.log('Folder created successfully:', newFolder);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const parentFolderId = navigationHistory.length > 0 ? navigationHistory[navigationHistory.length - 1] : 'root';

    try {
      const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: [parentFolderId],
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      const response = await axios.post(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const uploadedFile = response.data;

      setFiles((prevFiles) => [uploadedFile, ...prevFiles]);

      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : accessToken ? (
        <>
          <div className='top-container w-100'>
            <button type="button" className="button ms-2 add-folder-button" onClick={() => createNewFolder(prompt('Enter new folder name:'))}>
              <FaFolderPlus className='me-2 mb-15' />
              New directory
            </button>
            <label className="button ms-2 add-folder-button">
              <FaUpload className='me-2 mb-15' />
              Upload files
              <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
            </label>
            <div className="view-mode-buttons">
              <button className={`grid-icon ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode('grid')}>{viewMode === 'grid' ? <BsFillGridFill /> : <BsGrid />}</button>
              <button className={`list-icon ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode('list')}>{viewMode === 'grid' ? <FaRegRectangleList /> : <FaRectangleList />}</button>
            </div>
          </div>
          <div className='body-container'>
            <div style={{ width: '30%', float: 'left', borderRight: '1px solid #d2d2d2', padding: '10px' }}>
              <h4 style={{ marginBottom: '20px', borderBottom: '1px solid #d2d2d2', padding: '1px 0px 13px 0px' }}>File Management</h4>
              {sidebarFiles.map((item) => (
                <Directory files={item} accessToken={accessToken} onFolderClick={handleFolderClick} />))}
            </div>
            <div className="file-grid row" style={{ width: '70%', float: 'right', marginLeft: 0, display: 'block' }}>
              <div className='navigation-panel w-100'>
                <button
                  type="button"
                  className="button back-button"
                  onClick={handleNavigateBack}
                >
                  <TiArrowBack />
                </button>
                |  Home
                {folderHistory.map((folder, index) => (
                  <span key={index} className='navigation-history'>
                    <FaCaretRight />{folder}
                  </span>
                ))}
              </div>
              {selectedFileId ? (
                <div className="preview-container">
                  <ViewFile fileId={selectedFileId} accessToken={accessToken} />
                  <button className="close-button" onClick={handlePreviewClose}>Close Preview</button>
                </div>
              ) :
                (viewMode === 'grid' ? (
                  <GridView
                    files={files}
                    handleFolderClick={handleFolderClick}
                    handleView={handleView}
                    handleRename={handleRename}
                    handleDownload={handleDownload}
                  />
                ) : (
                  <ListView
                    files={files}
                    handleFolderClick={handleFolderClick}
                    handleView={handleView}
                    handleRename={handleRename}
                    handleDownload={handleDownload}
                  />
                ))
              }
            </div>
          </div>
        </>
      ) : (
        <p>Handling authorization code...</p>
      )}
    </>
  );
};

export default Drive;
