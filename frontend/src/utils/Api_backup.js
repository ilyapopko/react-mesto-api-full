class Api {
  _url
  _headers

  constructor(property) {
    this._url = property.url;
    this._headers = property.headers;
    this._credentials = property.credentials;

  }

  _processingResult(result) {
    if (result.ok) {
      return result.json();
    } else {
      return Promise.reject({
        status: result.status,
        message: result.statusText,
        url: result.url
      });
    }
  }

  getUserProperties() {
    return fetch(`${this._url}/users/me`, {
      // headers: this._headers,
      headers: {...this._headers, 'authorization': `Bearer ${localStorage.getItem('token')}`},
      credentials: this._credentials
    })
      .then(result => {
        return this._processingResult(result);
      });
  }

  updateUserAvatar(link) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: {...this._headers, 'authorization': `Bearer ${localStorage.getItem('token')}`},
      credentials: this._credentials,
      // headers: this._headers,
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
      headers: {...this._headers, 'authorization': `Bearer ${localStorage.getItem('token')}`},
      credentials: this._credentials,
      // headers: this._headers,
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
      headers: {...this._headers, 'authorization': `Bearer ${localStorage.getItem('token')}`},
      credentials: this._credentials,
      // headers: this._headers,
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
      headers: {...this._headers, 'authorization': `Bearer ${localStorage.getItem('token')}`},
      credentials: this._credentials,
      // headers: this._headers
    })
      .then(result => {
        return this._processingResult(result);
      });
  }

  addCard(data) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      // headers: this._headers,
      headers: {...this._headers, 'authorization': `Bearer ${localStorage.getItem('token')}`},
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
      // headers: this._headers
      headers: {...this._headers, 'authorization': `Bearer ${localStorage.getItem('token')}`},
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
      // headers: this._headers,
      headers: {...this._headers, 'authorization': `Bearer ${localStorage.getItem('token')}`},
      credentials: this._credentials,
    })
      .then(result => {
        return this._processingResult(result);
      });
  }
}

// export const apiServer = new Api({
//   url: 'https://mesto.nomoreparties.co/v1/cohort-27',
//   headers: {
//     authorization: '7da0d743-b2f7-439b-8a75-4db6d3ee0226',
//     'Content-Type': 'application/json'
//   }
// });

export const apiServer = new Api({
  url: 'http://localhost:3005',
  headers: {
    // authorization: localStorage.getItem('token'),
    'Content-Type': 'application/json'
  },
  credentials: 'include'
});