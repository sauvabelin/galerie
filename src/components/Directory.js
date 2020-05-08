import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Directory.scss';

function formatName(name) {
    let result = name;
    ['[GALERIE]', '[Galerie]', '[galerie]', 'GALERIE'].forEach((prefix) => {
        if (name.includes(prefix)) result = name.replace(prefix, '');
    });
    return result;
}

export default ({ data }) => (
    <Link className="directory-viewer mb-4" to={`/galerie${data.hashPath}`}>
        <div className="image">
            {data.thumbnail && (
                <div>
                    <img src={data.thumbnail.thumbnail} alt={data.thumbnail.filename} />
                </div>
            )}
            {!data.thumbnail
            && (
                <div className="placeholder d-flex align-items-center justify-content-center flex-column">
                    <FontAwesomeIcon icon="box-open" className="mb-2" />
                    Dossier vide
                </div>
            )}
        </div>
        <div className="metas mt-2 mb-3">
            <p className="m-0">{formatName(data.name)}</p>
        </div>
    </Link>
);
