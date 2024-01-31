import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import ListView from './ListView';
import GridView from './GridView';
import '../drobox-styles.css';

const CLIENT_ID = 'auloqq184qk0fju';
const CLIENT_SECRET = 'qjjf41nytrbrc16';
const REDIRECT_URI = 'http://localhost:3000/auth/callback';

const DropboxIntegration = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isListView, setIsListView] = useState(true);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const fileInputRef = React.createRef();

    const handleFileChange = async (event) => {
        try {
            setLoading(true);

            const file = event.target.files[0];

            const uploadResponse = await axios.post(
                'https://content.dropboxapi.com/2/files/upload',
                file,
                {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Dropbox-API-Arg': JSON.stringify({
                            path: `/uploads/${file.name}`,
                            mode: 'add',
                            autorename: true,
                            mute: false,
                        }),
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log('File uploaded successfully:', uploadResponse.data);
            fetchDataForPath(currentPath);
        } catch (error) {
            console.error('Error uploading file:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleView = () => {
        setIsListView((prevIsListView) => !prevIsListView);
    };

    useEffect(() => {
        const fetchData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const authorizationCode = urlParams.get('code');

            if (authorizationCode) {
                await exchangeTokenOnClient(authorizationCode);
            } else {
                const authorizationUrl =
                    `https://www.dropbox.com/oauth2/authorize` +
                    `?client_id=${CLIENT_ID}` +
                    `&redirect_uri=${REDIRECT_URI}` +
                    `&response_type=code`;

                window.location.href = authorizationUrl;
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            const searchDropbox = async () => {
                try {
                    const response = await axios.post(
                        'https://api.dropboxapi.com/2/files/search',
                        {
                            path: '',
                            query: searchQuery,
                            start: 0,
                            max_results: 10,
                            mode: 'filename',
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    setSearchResults(response.data.matches || []);
                } catch (error) {
                    console.error('Error searching Dropbox:', error);
                }
            };

            searchDropbox();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const exchangeTokenOnClient = async (authorizationCode) => {
        setLoading(true);
        try {
            const tokenResponse = await axios.post(
                'https://api.dropbox.com/oauth2/token',
                qs.stringify({
                    code: authorizationCode,
                    grant_type: 'authorization_code',
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    redirect_uri: REDIRECT_URI,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const tokenData = tokenResponse.data;
            setAccessToken(tokenData.access_token);
            console.log('Access Token:', tokenData.access_token);

            const response = await axios.post(
                'https://api.dropboxapi.com/2/files/list_folder',
                {
                    path: '',
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.access_token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setFiles(response.data.entries);
        } catch (error) {
            console.error('Error exchanging token:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataForPath = async (path) => {
        try {
            const response = await axios.post(
                'https://api.dropboxapi.com/2/files/list_folder',
                {
                    path: path,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setFiles(response.data.entries);
            setCurrentPath(path);
        } catch (error) {
            console.error('Error fetching folder contents:', error.response ? error.response.data : error.message);
        }
    };

    const handleFolderClick = (folderName) => {
        const newPath = currentPath === '' ? `/${folderName}` : `${currentPath}/${folderName}`;
        fetchDataForPath(newPath);
    };

    const handleBackClick = () => {
        const newPath = currentPath.slice(0, currentPath.lastIndexOf('/'));
        fetchDataForPath(newPath);
    };

    const handleRename = async (fileId, newName) => {
        try {
            const response = await axios.post(
                'https://api.dropboxapi.com/2/files/move_v2',
                {
                    from_path: fileId,
                    to_path: `/${newName}`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const updatedFile = response.data.metadata;
            setFiles((prevFiles) =>
                prevFiles.map((file) => (file.id === updatedFile.id ? { ...file, name: updatedFile.name } : file))
            );
            console.log('File renamed successfully:', updatedFile);
        } catch (error) {
            console.error('Error renaming file:', error.response ? error.response.data : error.message);
        }
    };

    const handleDownload = async (fileId) => {
        try {
            const metadataResponse = await axios.post(
                'https://api.dropboxapi.com/2/files/get_metadata',
                {
                    path: fileId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const fileMetadata = metadataResponse.data;

            if (fileMetadata['.tag'] === 'file') {
                const response = await axios.post(
                    'https://content.dropboxapi.com/2/files/download',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Dropbox-API-Arg': JSON.stringify({
                                path: fileId,
                            }),
                            'Content-Type': '',
                        },
                        responseType: 'blob',
                    }
                );

                const blob = new Blob([response.data]);
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileMetadata.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                console.log('File downloaded successfully');
            } else if (fileMetadata['.tag'] === 'folder') {
                setErrorMessage('Cannot download a folder. Please select a file.');
                return;
            } else {
                console.error('Unsupported file type:', fileMetadata);
            }
        } catch (error) {
            console.error('Error downloading file:', error.response ? error.response.data : error.message);
        }
    };

    const handleDelete = async (fileId) => {
        try {
            const response = await axios.post(
                'https://api.dropboxapi.com/2/files/delete_v2',
                {
                    path: fileId,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Delete Response:', response.data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="container">
            {errorMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                    {errorMessage}
                </div>
            )}
            {loading ? (
                <p>Loading...</p>
            ) : accessToken ? (

                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-wrap">
                                    <h5 className="font-size-16 me-3">Recent Files</h5>
                                    <div className="search-box mb-2 me-2">
                                        <div className="position-relative">
                                            <input
                                                type="text"
                                                className="form-control bg-light border-light rounded"
                                                placeholder="Search..."
                                                value={searchQuery}
                                                onChange={handleSearch}
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"
                                                viewBox="0 0 24 24" className="eva eva-search-outline search-icon">
                                                <g data-name="Layer 2">
                                                    <g data-name="search">
                                                        <rect width="24" height="24" opacity="0"></rect>
                                                        <path
                                                            d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z">
                                                        </path>
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ms-auto">
                                        {/* <a href="#" className="fw-medium text-reset">View All</a> */}
                                        <div className="mb-3">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => fileInputRef.current.click()}
                                            >
                                                Upload File
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-2"></hr>
                                <div className="container-m-nx container-m-ny bg-lightest mb-3">
                                    <ol className="breadcrumb text-big container-p-x py-3 m-0">
                                        <li className="breadcrumb-item">
                                            <a href="#">home</a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a href="#">projects</a>
                                        </li>
                                        <li className="breadcrumb-item active">site</li>
                                    </ol>
                                    <hr className="m-0" />
                                    <div className="file-manager-actions container-p-x py-2">
                                        <div>
                                            <div className="btn-group mr-2">
                                                <button className="btn" onClick={handleBackClick} disabled={!currentPath}>
                                                    Back
                                                </button>
                                                {/* <button type="button" className="btn btn-default md-btn-flat dropdown-toggle px-2" data-toggle="dropdown"><i className="ion ion-ios-settings"></i></button> */}
                                                <div className="dropdown-menu">
                                                    <a className="dropdown-item" href="#">Move</a>
                                                    <a className="dropdown-item" href="#">Copy</a>
                                                    <a className="dropdown-item" href="#">Remove</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                                <label
                                                    className={`btn btn-default icon-btn md-btn-flat ${isListView ? 'active' : ''
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="file-manager-view"
                                                        value="file-manager-col-view"
                                                        onChange={handleToggleView}
                                                        checked={isListView}
                                                        className='me-1'
                                                    />
                                                    <span className="ion ion-md-menu"></span>
                                                </label>
                                                <label
                                                    className={`btn btn-default icon-btn md-btn-flat ${!isListView ? 'active' : ''
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="file-manager-view"
                                                        value="file-manager-row-view"
                                                        onChange={handleToggleView}
                                                        checked={!isListView}
                                                        className='me-1'
                                                    />
                                                    <span className="ion ion-md-apps"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <hr className="m-0" /> */}
                                </div>

                                <div className="table-responsive table-height">
                                    <div>
                                        {isListView ? (
                                            <ListView
                                                files={searchResults.length === 0 ? files : searchResults}
                                                handleFolderClick={handleFolderClick}
                                                handleRename={handleRename}
                                                handleDownload={handleDownload}
                                                handleDelete={handleDelete}
                                            />
                                        ) : (
                                            <GridView
                                                files={searchResults.length === 0 ? files : searchResults}
                                                handleFolderClick={handleFolderClick}
                                                handleRename={handleRename}
                                                handleDownload={handleDownload}
                                                handleDelete={handleDelete}
                                            />
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Handling authorization code...</p>
            )}

            {uploadedFiles.length > 0 && (
                <div className="mb-3">
                    <h5>Uploaded Files</h5>
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropboxIntegration;
