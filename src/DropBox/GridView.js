import React from 'react';

const GridView = ({ files, handleFolderClick, handleRename, handleDownload, handleDelete }) => (
    <div className="grid-view">
        <div className="container flex-grow-1 light-style container-p-y">
            <div className="file-manager-container file-manager-col-view">
                <div className="file-manager-row-header">
                    <div className="file-item-name pb-2">Filename</div>
                    <div className="file-item-changed pb-2">Changed</div>
                </div>
                {files.map((file) => (
                    <div className="file-item" key={file.id} onClick={() => handleFolderClick(file.name)}>
                        <div className="file-item-select-bg bg-primary"></div>
                        {file.name && (
                            <>
                                {file['.tag'] === 'folder' ? (
                                    <span>
                                        <i className="bx bxs-folder file-item-icon  h1 text-warning"></i>
                                        {file.name.toLowerCase()}
                                    </span>
                                ) : (
                                    <span>
                                        {file.name.toLowerCase().endsWith('.png') ? (
                                            <span> <i className="bx bxs-image h1 file-item-icon  text-info text-primary"></i> </span>
                                        ) : (
                                            <span> <i className='bx bxs-file-pdf h1 text-danger file-item-icon text-primary '></i></span>
                                        )}
                                        {file.name.toLowerCase()}
                                    </span>
                                )}
                            </>
                        )}
                        <div className="file-item-changed">02/15/2018</div>
                        <div className="file-item-actions btn-group">
                            <div className="dropdown">
                                <a className="font-size-16 text-muted" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                    <i className="mdi mdi-dots-horizontal"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <a className="dropdown-item" href="#" onClick={() => handleFolderClick(file.name)}>
                                        Open
                                    </a>
                                    <a className="dropdown-item" href="#" onClick={() => handleRename(file.id, prompt('Enter new name:'))}>
                                        Rename
                                    </a>
                                    <a className="dropdown-item" href="#" onClick={() => handleDownload(file.id)}>
                                        Download
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="#" onClick={() => handleDelete(file.id)}>
                                        Remove
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default GridView;
