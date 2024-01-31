import { useState } from "react";
import axios from 'axios';

import { IoIosArrowDown } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";

const Directory = ({ files, accessToken, onFolderClick }) => {
    const [isExpanded, toggleExpanded] = useState(false);
    const [folderData, setFolderData] = useState([]);

    const handleFolderClick = async (folderId) => {
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

            setFolderData(folderContent);
            toggleExpanded(true);
        } catch (error) {
            console.error('Error fetching folder content:', error);
        }
    };

    if (files.mimeType === "application/vnd.google-apps.folder") {
        return (
            <ul className="sidebar">
                <li>
                    <div className="sidebar-file-link">
                        {isExpanded ? <IoIosArrowDown onClick={() => toggleExpanded(false)} /> : <RiArrowRightSLine onClick={() => handleFolderClick(files.id)} />}
                        <div onClick={() => onFolderClick(files.id, files.name)} style={{ display: 'inline-block', cursor: 'pointer', width: '90%' }}>
                            <img className="icon-image folder" src="folder.png" alt="Folder Icon" />
                            {files.name}
                        </div>
                    </div>
                    {isExpanded && (
                        <ul className="sub-folder">
                            {folderData.map((item) => (
                                <Directory files={item} accessToken={accessToken} onFolderClick={onFolderClick} />

                            ))}
                        </ul>
                    )}
                </li>
            </ul>
        )
    }
    // else if (files.mimeType === "application/pdf") {
    //     return (
    //         <ul className="sidebar">
    //             <li>
    //                 <div className="sidebar-file-link">
    //                     <img className="icon-image" src="pdf.png" alt="PDF Icon" />
    //                     {files.name}
    //                 </div>
    //             </li>
    //         </ul>
    //     )
    // }
}

export default Directory;
