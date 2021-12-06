import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import EditCardPopup from "./EditCardPopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import InfoTooltip from "./InfoTooltip";
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';

import { server } from "../utils/Server";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [tooltipMessage, setToolTipMessage] = useState();
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
  const [isEditCardPopupOpen, setIsEditCardPopupOpen] = useState(false);

  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isUserInfoOpened, setIsUserInfoOpened] = useState(false);

  const history = useHistory();

  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    setIsAuthChecking(true);
    server.checkToken()
      .then((userData) => {
        setCurrentUser(userData);
        setIsLoggedIn(true);
        history.push('/');
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => setIsAuthChecking(false));
  }, [history]);

  useEffect(() => {
    if (isLoggedIn) {
      setIsCardsLoading(true);
      server.getAllCards()
        .then((cardData) => {
          setCards(cardData);
        })
        .catch((err) => {
          showError(err);
        })
        .finally(() => setIsCardsLoading(false));
    }
  }, [isLoggedIn]);

  const handleLogin = ({ email, password }) => {
    server.authorize({ email, password })
      .then((data) => {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        history.push('/');
        setToolTipMessage({ message: "Вы успешно авторизировались!", fail: false });
      })
      .catch(showError);
  };

  const handleRegister = ({ email, password }) => {
    server.register({ email, password })
      .then(() => {
        history.push('/sign-in');
        setToolTipMessage({ message: "Вы успешно зарегистрировались!", fail: false });
      })
      .catch(showError);
  };

  const handleLogout = () => {
    server.logout()
      .then((data) => {
        console.log(data.message);
        setToolTipMessage({ message: data.message, fail: false })
      })
      .catch(showError)
      .finally(() => {
        setCurrentUser({});
        setIsUserInfoOpened(false);
        setIsLoggedIn(false);
        history.push('/sign-in');
      });
  };

  const showError = (err) => {
    setToolTipMessage({
      message: `Что-то пошло не так! ${err.status} ${err.message}`,
      fail: true
    });
  }

  const handleCloseAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddCardPopupOpen(false);
    setIsEditCardPopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard(null);
    setToolTipMessage();
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleUpdateUser = async (data) => {
    try {
      const updateData = await server.updateUserProperties(data);
      setCurrentUser((oldCurrentUser) => ({
        ...oldCurrentUser,
        name: updateData.name,
        about: updateData.about,
      }));
      handleCloseAllPopups();
    } catch (err) {
      showError(err);
    }
  }

  const handleUpdateAvatar = async (link) => {
    try {
      const updateData = await server.updateUserAvatar(link);
      setCurrentUser((oldCurrentUser) => ({
        ...oldCurrentUser,
        avatar: updateData.avatar,
      }));
      handleCloseAllPopups();
    } catch (err) {
      showError(err);
    }
  }

  const handleAddCardClick = () => {
    setIsAddCardPopupOpen(true);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  const toggleLikeCard = (card, isLiked) => {
    if (isLiked) {
      card.likes = card.likes.filter((user) => user._id !== currentUser._id);
    } else {
      card.likes.push(currentUser);
    }
  }

  const handleCardLike = async (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    //Добавляем/удаляем текущего юзера в массив лайков карточки до получения ответа
    // от сервера для ускорения реакции интерфейса
    toggleLikeCard(card, isLiked);
    try {
      await server.setLikeCard(isLiked, card._id);
    } catch (err) {
      showError(err);
      //обратим действие установочной функции так как сервер вернул ошибку
      toggleLikeCard(card, !isLiked);
    }
  }

  const handleCardDelete = (card) => {
    setSelectedCard(card);
    setIsConfirmDeletePopupOpen(true);
  }

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setIsEditCardPopupOpen(true);
  }

  const handleAddCard = async (data) => {
    const newCard = await server.addCard(data);
    setCards([newCard, ...cards]);
    handleCloseAllPopups();
  }

  const handleSaveCard = (data, card) => {
    return server.updateCard({ id: card._id, name: data.name })
      .then((updateData) => {
        card.name = updateData.name;
        handleCloseAllPopups();
      })
      .catch(showError);
  }

  const handleDeleteCardSubmit = async (card) => {
    try {
      await server.deleteCard(card._id);
      setCards((cards) => {
        return cards.filter((c) => c._id !== card._id);
      });
      handleCloseAllPopups();
    } catch (err) {
      showError(err);
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__container">
        <Header
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          isUserInfoOpened={isUserInfoOpened}
          setIsUserInfoOpened={setIsUserInfoOpened}
          onLogout={handleLogout}
        />
        <Switch>
          <ProtectedRoute isChecking={isAuthChecking} isLoggedIn={isLoggedIn} exact path="/">
            <Main cards={cards} card={selectedCard} isCardsLoading={isCardsLoading}
              onEditAvatar={handleEditAvatarClick} onEditProfile={handleEditProfileClick}
              onAddCard={handleAddCardClick} onCardClick={handleCardClick} onCardLike={handleCardLike}
              onCardDelete={handleCardDelete} onEditCard={handleEditCard} />
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={handleCloseAllPopups}
              onUpdateAvatar={handleUpdateAvatar} />
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={handleCloseAllPopups}
              onUpdateUser={handleUpdateUser} />
            <AddPlacePopup isOpen={isAddCardPopupOpen} onClose={handleCloseAllPopups} onSaveCard={handleAddCard} />
            <EditCardPopup isOpen={isEditCardPopupOpen} onClose={handleCloseAllPopups} onSaveCard={handleSaveCard}
              card={selectedCard} />
            <ConfirmDeletePopup card={selectedCard} isOpen={isConfirmDeletePopupOpen} onClose={handleCloseAllPopups}
              onDeleteCard={handleDeleteCardSubmit} />
            <ImagePopup currentCard={selectedCard} setCurrentCard={setSelectedCard} cards={cards} isOpen={isImagePopupOpen}
              onClose={handleCloseAllPopups} />
            <InfoTooltip isOpen={!!tooltipMessage} onClose={handleCloseAllPopups} message={tooltipMessage} />
          </ProtectedRoute>
          <Route path="/sign-in">
            {isLoggedIn ? (
              <Redirect to="/" />
            ) : (
              <Login onSubmit={handleLogin} />
            )}
          </Route>
          <Route path="/sign-up">
            {isLoggedIn ? (
              <Redirect to="/" />
            ) : (
              <Register onSubmit={handleRegister} />
            )}
          </Route>
          <Route path="*">
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
