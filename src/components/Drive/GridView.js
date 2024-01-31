import React from 'react';

const GridView = ({ files, handleFolderClick, handleView, handleRename, handleDownload }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px' }}>
      {files.map((file) => (
        <div key={file.id} className="file-item col-lg-2 col-md-3 col-sm-4 col-6">
          {file.mimeType === 'application/vnd.google-apps.folder' && (
            <div>
              <button
                type="button"
                className='folder-button'
                style={{ border: 'none', backgroundColor: 'transparent' }}
                onClick={() => handleFolderClick(file.id, file.name)}
              >
                <div style={{ width: '100%' }}>
                  <img
                    src={process.env.PUBLIC_URL + '/folder.png'}
                    alt="Folder Icon"
                    className="file-icon"
                    style={{ height: '100px', width: '100%;' }}
                  />
                </div>
                <div className="file-detail">
                  <span className="file-name" style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {file.name}
                  </span>
                  <div className="dropdown">
                    <button className="dropbtn">&#8942;</button>
                    <div className="dropdown-content">
                      <button onClick={(e) => { e.stopPropagation(); handleRename(file.id, prompt('Enter new name:')); }}>Rename</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDownload(file.id); }}>Download</button>
                      {/* <button onClick={(e) => { e.stopPropagation(); handleView(file.id); }}>Preview</button> */}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )} 
          {file.mimeType === 'application/pdf' && (
            <div style={{ padding: '0px 6px' }} onClick={() => handleView(file.id, file.name)}>
              <div style={{ width: '100%', textAlign: 'center' }}>
                <img
                  src={process.env.PUBLIC_URL + '/pdf.png'}
                  alt="PDF Icon"
                  className="file-icon"
                  style={{ height: '100px', padding: '10px' }}
                />
              </div>
              <div className="file-detail">
                <span className="file-name" style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {file.name}
                </span>
                <div class="dropdown">
                  <button class="dropbtn">&#8942;</button>
                  <div class="dropdown-content">
                    <button onClick={(e) => { e.stopPropagation(); handleRename(file.id, prompt('Enter new name:')); }}>Rename</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDownload(file.id); }}>Download</button>
                    {/* <button onClick={() => handleView(file.id, file.name)}>Preview</button> */}
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      ))}
    </div>
  );
};

export default GridView;
