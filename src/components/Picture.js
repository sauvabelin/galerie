import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Picture.scss';

export default class extends Component {
    render() {
        const { data, onClick } = this.props;
        return (
            <div className="picture-viewer col-6 col-sm-4 col-md-2 pt-0 pr-4 pl-0 pb-4" onClick={onClick}>
                <div className="picture">
                    <div className="overlay d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon="search" />
                    </div>
                    <img src={data.thumbnail} alt="swag" />
                </div>
            </div>
        );
    }
}
