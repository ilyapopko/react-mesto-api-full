class Api {
  _url
  _headers
  _credentials

  constructor(property) {
    this._url = property.url;
    this._headers = property.headers;
    this._credentials = property.credentials;
  }

  _processingResult(response) {
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
      credentials: this._credentials,
      body: JSON.stringify({ password, email })
    })
      .then(this._processingResult);
  }

  authorize({ email, password }) {
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify({ password, email })
    })
      .then(this._processingResult);
  }

  logout() {
    return fetch(`${this._url}/signout`, {
      method: 'GET',
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(this._processingResult);
  }

  ////////////////////////???????????????????????????????
  checkToken() {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(this._processingResult);
  }

  //////////////???????????????????????????????????????
  getUserProperties() {
    return fetch(`${this._url}/users/me`, {
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(result => {
        return this._processingResult(result);
      });
  }

  updateUserAvatar(link) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify({
        avatar: link
      })
    })
      .then(result => {
        return this._processingResult(result);
      });
  }

  updateUserProperties(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
      .then(result => {
        return this._processingResult(result);
      });
  }

  updateCard({id, name}) {
    return fetch(`${this._url}/cards/${id}`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify({
        name
      })
    })
      .then(result => {
        return this._processingResult(result);
      });
  }

  getAllCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(result => {
        return this._processingResult(result);
      });
  }

  addCard(data) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      credentials: this._credentials,
      body: JSON.stringify({name: data.name, link: data.link})
    })
      .then(result => {
        return this._processingResult(result);
      });
  }

  deleteCard(idCard) {
    return fetch(`${this._url}/cards/${idCard}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(result => {
        return this._processingResult(result);
      });
  }

  setLikeCard(isLiked, id) {
    const metodHtml = isLiked ? 'DELETE' : 'PUT';
    return fetch(`${this._url}/cards/${id}/likes`, {
      method: metodHtml,
      headers: this._headers,
      credentials: this._credentials,
    })
      .then(result => {
        return this._processingResult(result);
      });
  }

}

export const server = new Api({
  url: 'https://mesto-ilyap.students.nomoredomains.work',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
});