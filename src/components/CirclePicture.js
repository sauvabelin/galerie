import React, { Component } from 'react';
import './CirclePicture.scss';

export default class extends Component {
    render() {
        const {
            src,
            size,
            style,
            className,
        } = this.props;
        const st = {
            padding: 0,
            ...style,
        };

        return (
            <div
                className={`circle-picture d-flex justify-content-center ${className}`}
                style={{ width: size, height: size, ...st }}>
                <div className="picture d-flex justify-content-center">
                    <img src={src} alt="" />
                </div>
            </div>
        );
    }
}
