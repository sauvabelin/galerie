import React, { Component } from 'react';
import Logo from '../pictures/logo.jpg';
import Api from '../Api';
import CirclePicture from '../components/CirclePicture';
import './Login.scss';

class Login extends Component {
    constructor(props) {
        super(props);

        const pictures = [
            { id: 0, size: 30 + Math.floor(Math.random() * 20) },
            { id: 1, size: 25 + Math.floor(Math.random() * 10) },
            { id: 2, size: 15 + Math.floor(Math.random() * 10) },
            { id: 3, size: 30 + Math.floor(Math.random() * 20) },
            { id: 4, size: 15 + Math.floor(Math.random() * 10) },
            { id: 5, size: 25 + Math.floor(Math.random() * 10) },
            { id: 6, size: 30 + Math.floor(Math.random() * 20) },
            { id: 7, size: 25 + Math.floor(Math.random() * 10) },
            { id: 8, size: 15 + Math.floor(Math.random() * 10) },
            { id: 9, size: 30 + Math.floor(Math.random() * 20) },
            { id: 10, size: 15 + Math.floor(Math.random() * 10) },
            { id: 11, size: 25 + Math.floor(Math.random() * 10) },
            { id: 12, size: 30 + Math.floor(Math.random() * 20) },
            { id: 13, size: 25 + Math.floor(Math.random() * 10) },
            { id: 14, size: 15 + Math.floor(Math.random() * 10) },
        ].map(s => (
            <div className={`holder-${s.id}`} key={s.id}>
                <CirclePicture className={`picture-${s.id}`} src={`http://lorempixel.com/200/${200 + s.id}`} size={`${s.size}px`} />
            </div>
        ));

        this.state = {
            error: '',
            counter: 0,
            username: '',
            password: '',
            key: '',
            pictures,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { history } = this.props;
        if (Api.hasData()) {
            Api.queryDirectory('').then(() => {
                history.push('/album');
            });
        }
    }

    handleClick() {
        this.setState(state => ({
            counter: state.counter + 1,
        }));
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState(() => ({
            [name]: value,
        }));
    }

    handleSubmit(event) {
        event.preventDefault();
        const { history } = this.props;
        const { username, password, key } = this.state;
        if (key.length === 0) { // Mode username password
            Api.loginUser(username, password).then(({ data: { token } }) => {
                Api.setToken(token);
                Api.queryDirectory('').then(() => {
                    history.push('/album');
                }).catch(() => {
                    this.setState(() => ({ error: 'Votre mot de passe a expiré, connectez-vous sur netbs.sauvabelin.ch pour le changer' }));
                });
            }).catch(() => {
                this.setState(() => ({ error: 'Nom d\'utilisateur ou mot de passe incorrect' }));
            });
        } else {
            Api.loginParent(key).then(() => {
                history.push('/album');
            }).catch(() => {
                this.setState(() => ({ error: 'Clé incorrecte' }));
            });
        }
    }

    render() {
        const { counter, pictures, error } = this.state;

        return (
            <div className="login-page d-flex align-items-center justify-content-center flex-column">
                <div className="pictures d-flex align-items-center justify-content-center">
                    { pictures }
                    <CirclePicture className="logo" src={Logo} size="80px" style={{ padding: '0.8em' }} />
                </div>
                <div className="bottom">
                    <form onSubmit={this.handleSubmit} className="form d-flex flex-column">
                        <input name="username" type="text" className="mb-2" placeholder="Nom d'utilisateur" onChange={this.handleChange} />
                        <input name="password" type="password" placeholder="Mot de passe" onChange={this.handleChange} />
                        <div className="split text-muted mt-2 mb-2 d-flex justify-content-center"><span>Pour les parents</span></div>
                        <input name="key" type="text" placeholder="Clé" onChange={this.handleChange} />
                        <button type="submit" className="mt-2">Connexion</button>
                    </form>
                    <div>
                        <p className="text-danger">{error}</p>
                        <p className="pt-3 text-muted text-center" onClick={this.handleClick}>{counter < 5
                            ? <span>&copy; Brigade de Sauvabelin</span>
                            : <span>Et fait avec <span style={{ color: 'red' }}>&hearts;</span> par Guillaume Hochet</span>}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
