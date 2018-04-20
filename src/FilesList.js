import React from 'react';

const FilesList = ({ metadata }) => (
  <div>
    {metadata.map(data => (
      <span key={data.name}>
        <a target="_blank" href={data.downloadURL}>
          {data.name}
        </a>
      </span>
    ))}
  </div>
);

export default FilesList;
