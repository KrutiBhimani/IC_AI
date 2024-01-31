import React from 'react';

const ListView = ({ files, handleFolderClick, handleView, handleRename, handleDownload }) => {
  return (
    <table className='table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          file.mimeType === 'application/vnd.google-apps.folder' ? (
            <tr className='table-row' onClick={() => handleFolderClick(file.id, file.name)}>
              <td>
                <img src="folder.png" alt="Folder Icon" className="list-icon-image" />
                {file.name}
              </td>
              <td>{file.mimeType}</td>
              <td>
                <div className="dropdown">
                  <button className="dropbtn">&#8942;</button>
                  <div className="dropdown-content">
                    <button onClick={(e) => { e.stopPropagation(); handleRename(file.id, prompt('Enter new name:')); }}>Rename</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDownload(file.id); }}>Download</button>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            <tr className='table-row' onClick={() => handleView(file.id, file.name)}>
              <td>
                <img src="pdf.png" alt="PDF Icon" className="list-icon-image" />
                {file.name}
              </td>
              <td>{file.mimeType}</td>
              <td>
                <div className="dropdown">
                  <button className="dropbtn">&#8942;</button>
                  <div className="dropdown-content">
                    <button onClick={(e) => { e.stopPropagation(); handleRename(file.id, prompt('Enter new name:')); }}>Rename</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDownload(file.id); }}>Download</button>
                  </div>
                </div>
              </td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
