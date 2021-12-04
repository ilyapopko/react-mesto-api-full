class Auth {
  _url
  _headers

  constructor(property) {
    this._url = property.url;
    this._headers = property.headers;
    this._credentials = property.credentials;
  }

  _checkResponse(response) {
    return response.ok ? response.json() : Promise.reject({
      status: response.status,
      message: response.statusText,
      url: response.url
    });
  }

  register({ email, password }) {
    return fetch(`${this._url}/signup`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({ password, email })
    })
      .then(this._checkResponse);
  }

  authorize({ email, password }) {
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({ password, email })
    })
      .then(this._checkResponse);
  }

  logout() {
    return fetch(`${this._url}/signout`, {
      method: 'GET',
      headers: this._headers,
    })
      .then(this._checkResponse);
  }

  checkToken() {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: this._headers,
    })
      .then(this._checkResponse);
  }

}

export const auth = new Auth({
  url: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
});