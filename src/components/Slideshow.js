import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSTransition } from 'react-transition-group';
import Slider from 'react-slick';
import { PinchView } from 'react-pinch-zoom-pan';
import './Slideshow.scss';

function SampleArrow({ icon, onClick }) {
    return (
        <button onClick={onClick} type="button" className={`slider-arrow d-none d-sm-block ${icon}`}>
            <FontAwesomeIcon icon={icon} />
        </button>
    );
}

/* eslint-disable no-return-assign */
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = { active: -1 };
        this.slider = React.createRef();
        this.close = this.close.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { medias, selected } = this.props;
        const active = selected !== nextProps.selected
            ? medias.indexOf(nextProps.selected)
            : -1;
        this.setState(() => ({ active }));
    }

    close() {
        const { onEnd } = this.props;
        this.setState({ active: -1 });
        onEnd();
    }

    render() {
        const { medias } = this.props;
        const { active } = this.state;
        const sliderSettings = {
            centerMode: true,
            infinite: false,
            centerPadding: '0',
            slidesToShow: 1,
            slidesToScroll: 1,
            lazyLoad: true,
            afterChange: i => this.setState({ active: i }),
            nextArrow: <SampleArrow icon="chevron-right" />,
            prevArrow: <SampleArrow icon="chevron-left" />,
        };

        const slides = medias.map(m => (
            <div key={m.bignail}>
                <div className="d-block d-sm-none pinch-holder">
                    <PinchView
                        maxScale={3}
                        initialScale={1}
                        containerRatio={150}
                        backgroundColor="transparent">
                        <img src={m.bignail} alt={m.bignail} />
                    </PinchView>
                </div>
                <div className="image-holder d-sm-flex justify-content-center align-items-center d-none">
                    <img src={m.bignail} alt={m.bignail} />
                </div>
            </div>
        ));
        return (
            <div>
                <CSSTransition
                    in={active !== -1}
                    timeout={300}
                    classNames="tr-slideshow"
                    onEnter={() => this.slider.slickGoTo(active)}
                    unmountOnExit>
                    <div className="slideshow">
                        <div className="toolbar">
                            {medias[active] && (
                                <a rel="noopener noreferrer" target="_blank" href={medias[active].bignail}>
                                    <FontAwesomeIcon icon="download" />
                                </a>
                            )}
                            <button className="close-btn" type="button" onClick={() => this.close()}>
                                <FontAwesomeIcon icon="times" />
                            </button>
                        </div>

                        <div className="slider">
                            <Slider
                                ref={slider => (this.slider = slider)}
                                {...sliderSettings}>
                                {slides}
                            </Slider>
                        </div>
                    </div>
                </CSSTransition>
            </div>
        );
    }
}
