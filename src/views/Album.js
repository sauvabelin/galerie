import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import DOMPurify from 'dompurify';
import { CSSTransition } from 'react-transition-group';

import './Album.scss';
import Api from '../Api';
import Loader from '../pictures/loader.gif';
import Picture from '../components/Picture';
import Directory from '../components/Directory';
import Slideshow from '../components/Slideshow';

function formatName(name) {
    let result = name;
    ['[GALERIE]', '[Galerie]', '[galerie]', 'GALERIE'].forEach((prefix) => {
        if (name.includes(prefix)) result = name.replace(prefix, '');
    });
    if (result === 'originals') return 'Accueil';
    return result;
}

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            loading: true,
            name: null,
            thumbnail: null,
            description: null,
            children: [],
            medias: [],
            history: [],
            changes: null,
        };

        this.choosePicture = this.choosePicture.bind(this);
        this.fetchDirectory = this.fetchDirectory.bind(this);
        this.buildChildren = this.buildChildren.bind(this);
        this.buildHistory = this.buildHistory.bind(this);
        this.buildMedias = this.buildMedias.bind(this);
        this.loadLatestChanges = this.loadLatestChanges.bind(this);
    }

    componentDidMount() {
        const { match } = this.props;
        this.fetchDirectory(match.params.path);
    }

    componentWillReceiveProps(nextProps) {
        const { match } = this.props;
        if (nextProps.match.params.path !== match.params.path) {
            this.fetchDirectory(nextProps.match.params.path);
        }
    }

    fetchDirectory(path) {
        this.setState({ loading: true });
        const { history } = this.props;
        Api.queryDirectory(path).then(({ data }) => {
            this.setState({ loading: false, selected: null, ...data });
            this.buildHistory(data);
            if (data.name === 'originals') this.loadLatestChanges();
        }).catch(() => {
            history.push('/login');
        });
    }

    loadLatestChanges() {
        Api.queryLatestChanges().then(({ data }) => {
            const changes = data.map((it) => {
                const path = it.path.split('/');
                return (
                    <div className="change">
                        <Link to={`/galerie/${it.hash}`}>
                            <div className="d-flex flex-column d-md-none change-mobile mb-3 p-2">
                                <span className="name">{formatName(it.name)}</span>
                                <span className="path">{path.slice(0, -1).map(i => formatName(i).trim()).join('/')}</span>
                                <span className="date">Modifié le {it.date}</span>
                            </div>
                            <div className="d-none d-md-flex change-desktop mb-2 align-items-center">
                                <span className="date pb-1 pt-1 pl-2 pr-2">{it.date}</span>
                                <span className="name ml-2">{formatName(it.name)}</span>
                                <span className="path ml-2 text-muted">{path.slice(0, -1).map(i => formatName(i).trim()).join('/')}</span>
                            </div>
                        </Link>
                    </div>
                );
            });
            this.setState({ changes });
        });
    }

    buildHistory(data) {
        const { path, hashPath } = data;
        const history = [];
        let currentHashPath = '';
        const hashPathData = hashPath.replace(/\/$/, '').split('/');
        const pathData = path.replace(/\/$/, '').split('/');
        for (let i = 0; i < pathData.length - 1; i += 1) {
            currentHashPath += `${hashPathData[i]}/`;
            history.push((
                <li key={currentHashPath}>
                    <Link to={`/galerie${currentHashPath}`}>{pathData[i] === '' ? 'Accueil' : formatName(pathData[i])}</Link>
                </li>
            ));
        }

        this.setState(() => ({ history }));
    }

    choosePicture(picture) {
        this.setState(() => ({
            selected: picture,
        }));
    }

    buildChildren() {
        const { children } = this.state;
        if (children.length === 0) return '';
        const dirs = children.map(dir => (
            <div className="col-6 col-sm-4 col-md-2" key={dir.hashPath}>
                <Directory data={dir} />
            </div>
        ));
        return (
            <div>
                <h2 className="mb-3">Dossiers</h2>
                <div className="row">
                    {dirs}
                </div>
            </div>
        );
    }

    buildMedias() {
        const { medias } = this.state;
        if (medias.length === 0) return '';
        return medias.map(data => (
            <Picture data={data} onClick={() => this.choosePicture(data)} key={data.thumbnail} />
        ));
    }

    render() {
        const {
            selected,
            changes,
            name,
            thumbnail,
            description,
            history,
            children,
            medias,
            loading,
        } = this.state;

        const sliderSettings = {
            centerMode: true,
            infinite: false,
            className: 'swag-slider',
            arrows: false,
            slidesToShow: 1,
            rows: 4,
            slidesPerRow: 6,
            centerPadding: '0',
            dots: true,
            lazyLoad: true,
            customPaging: i => <span>{i + 1}</span>,
            responsive: [
                {
                    breakpoint: 576,
                    settings: {
                        rows: 4,
                        slidesPerRow: 2,
                    },
                },
            ],
        };

        const cleanDescription = description ? DOMPurify.sanitize(description) : null;

        return (
            <div className={`container album pt-3 pt-lg-5 ${selected !== null ? 'noscroll' : ''}`}>
                <Slideshow
                    medias={medias}
                    selected={selected}
                    onEnd={() => this.setState({ selected: null })} />
                <div className="row">
                    <div className="col-12 col-sm-3">
                        {thumbnail !== null && (
                            <div className="thumbnail">
                                <img src={thumbnail.bignail} alt="album logo" className="logo mb-sm-2" />
                                <CSSTransition
                                    in={loading}
                                    timeout={100}
                                    classNames="loader"
                                    unmountOnExit>
                                    <div className="loader">
                                        <img src={Loader} alt="loading" />
                                    </div>
                                </CSSTransition>
                            </div>
                        )}
                        {history.length > 0 && (
                            <ul className="history mt-lg-3 pt-lg-2">
                                {history}
                                <li>{formatName(name)}</li>
                            </ul>
                        )}
                    </div>
                    <div className="col-12 col-sm-9">
                        <h1 className="m-0 mb-3 pt-2">{formatName(name || '')}</h1>
                        {description && (
                            <div className="description p-3 p-md-4 mb-3">
                                <p dangerouslySetInnerHTML={{ __html: cleanDescription }} />
                            </div>
                        )}
                        {children.length > 0 && (
                            <div className="row mb-lg-5">
                                <div className="col-12">{this.buildChildren()}</div>
                            </div>
                        )}
                        {medias.length > 0 && (
                            <div>
                                <h2 className="mb-3">Photos</h2>
                                <Slider {...sliderSettings}>
                                    {this.buildMedias()}
                                </Slider>
                            </div>
                        )}
                        {name === 'originals' && (
                            <div className="mt-4 mt-md-0">
                                <h2 className="mb-3">Les 10 dernières modifications</h2>
                                <div>{changes}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
