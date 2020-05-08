import axios from 'axios';

const PART_KEY = 'galerie.part';
const TOKEN_KEY = 'galerie.token';

export const parts = {
    PARENT: '/public/netBS',
    USER: '/netBS',
};

class Api {
    constructor() {
        this.part = localStorage.getItem(PART_KEY);
        this.token = localStorage.getItem(TOKEN_KEY);
        this.layer = axios.create({
            baseURL: 'https://netbs.sauvabelin.ch/api/v1',
        });
    }

    queryDirectory(path) {
        return this.layer.get(`${this.part}/galerie/directory`, {
            params: { path },
            headers: { 'X-Authorization': `Bearer ${this.token}` },
        });
    }

    queryLatestChanges() {
        return this.layer.get('public/netBS/galerie/latest-change');
    }

    queryRootPictures() {
        return this.layer.get(`${parts.PARENT}/galerie/root-pictures`);
    }

    loginUser(username, password) {
        this.setPart(parts.USER);
        return this.layer.post(`${this.part}/gettoken`, { username, password });
    }

    loginParent(key) {
        this.setPart(parts.PARENT);
        this.setToken(key);
        return this.queryDirectory('');
    }

    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
        this.token = token;
    }

    setPart(part) {
        localStorage.setItem(PART_KEY, part);
        this.part = part;
    }

    logout() {
        this.setPart(null);
        this.setToken(null);
    }

    hasData() {
        return this.part !== null;
    }
}

export default new Api();
