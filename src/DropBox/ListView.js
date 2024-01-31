import React from 'react';

const ListView = ({ files, handleFolderClick, handleRename, handleDownload, handleDelete }) => (
    <div className="table-responsive table-height">
        <table className="table align-middle table-nowrap table-hover mb-0">
            <thead className="table-light">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Date modified</th>
                    <th scope="col">Size</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {files.map((file) => (
                    <tr key={file.id}>
                        <td onClick={() => handleFolderClick(file.name)}>
                            {file.name && (
                                <>
                                    {file['.tag'] === 'folder' ? (
                                        <span>
                                            <i className="bx bxs-folder h1 mb-0 text-warning font-size-16 align-middle text-primary me-2"></i>
                                            {file.name.toLowerCase()}
                                        </span>
                                    ) : (
                                        <span>
                                            {file.name.toLowerCase().endsWith('.png') ? (
                                                <i className="bx bxs-image h1 mb-0 text-info font-size-16 align-middle text-primary me-2"></i>
                                            ) : (
                                                <i className='bx bxs-file-pdf h1 mb-0 text-danger font-size-16 align-middle text-primary me-2'></i>
                                            )}
                                            {file.name.toLowerCase()}
                                        </span>
                                    )}
                                </>
                            )}
                        </td>
                        <td>12-10-2020, 09:45</td>
                        <td>09 KB</td>
                        <td>
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
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default ListView;
