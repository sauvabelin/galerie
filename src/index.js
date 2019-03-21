import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSearch,
    faBoxOpen,
    faTimes,
    faChevronLeft,
    faChevronRight,
    faDownload,
} from '@fortawesome/free-solid-svg-icons';
import './index.scss';
import App from './App';

library.add(faSearch);
library.add(faBoxOpen);
library.add(faTimes);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faDownload);

ReactDOM.render(<App />, document.getElementById('root'));
