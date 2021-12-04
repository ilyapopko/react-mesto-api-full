import React, { useContext, useRef, useState } from 'react';
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ViewAuthorPopup from "./ViewAuthorPopup";
import ViewLikePopup from "./ViewLikePopup";

const MIN_HEIGHT_POPUP_AUTHOR = 184;
const MIN_HEIGHT_POPUP_LIKE_LIST = 45;

const Card = ({ card, onCardClick, onCardLike, onCardDelete, onEditCard }) => {
  const currentUser = useContext(CurrentUserContext);
  const imageRef = useRef();
  const captionRef = useRef();
  const likeRef = useRef();
  const isOwner = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const [isViewAuthorPopupOpen, setIsViewAuthorPopupOpen] = useState(false);
  const [isViewLikePopupOpen, setIsViewLikePopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 'auto', bottom: 'auto' });
  const [needUpdateView, setNeedUpdateView] = useState(false);

  const handleClick = () => {
    onCardClick(card);
  }

  const handleLikeClick = () => {
    setNeedUpdateView(!needUpdateView);
    onCardLike(card);
  }

  const handleDeleteClick = () => {
    onCardDelete(card);
  }

  const handleEditClick = () => {
    onEditCard(card);
  }

  const handleSetupImageProperties = () => {
    if (imageRef.current.naturalWidth < 150) {
      imageRef.current.style.objectFit = 'none';
    }
  }

  const hideInfo = () => {
    setIsViewAuthorPopupOpen(false);
    setIsViewLikePopupOpen(false);
  }

  const showAuthorInfo = (e) => {
    const element = captionRef.current;
    setPopupPosition({
      top: e.clientY > MIN_HEIGHT_POPUP_AUTHOR ? 120 : element.offsetTop + element.offsetHeight,
      bottom: 'auto'
    });
    setIsViewAuthorPopupOpen(true);
  }

  const handleShowLikeInfo = (e) => {
    const element = likeRef.current;
    //На момент вывода окошка не знаем истинную высоту, поэтому делаем костыльный расчет приблизительной высоты
    const approximateHeight = MIN_HEIGHT_POPUP_LIKE_LIST * card.likes.length;
    setPopupPosition({
      top: e.clientY > approximateHeight ? 'auto' : element.offsetTop + element.offsetHeight,
      bottom: e.clientY > approximateHeight ? element.offsetParent.offsetHeight - element.offsetTop + 5 : 'auto'
    });
    setIsViewLikePopupOpen(true);
  }

  return (
    <article className="card">
      <img src={card.link} alt={`Фотография ${card.name}`} className="card__image" ref={imageRef}
        onClick={handleClick} onLoad={handleSetupImageProperties} />
      <div className="card__button-container">
        <button
          className={`card__delete-button ${isOwner ? 'card__delete-button_visible' : ''}`}
          type="button" aria-label="Удалить карточку" onClick={handleDeleteClick} />
        <button
          className={`card__edit-button ${isOwner ? 'card__edit-button_visible' : ''}`}
          type="button" aria-label="Редактировать карточку" onClick={handleEditClick} />
      </div>
      <div className="card__description">
        <h2 className="card__caption" ref={captionRef} onMouseEnter={showAuthorInfo}
          onMouseOut={hideInfo}>{card.name}</h2>
        <div className="card__like-container">
          <button className={`card__like-button ${isLiked ? 'card__like-button_active' : ''}`} type="button"
            aria-label="Лайкнуть" onClick={handleLikeClick}
            ref={likeRef} onMouseEnter={handleShowLikeInfo} onMouseOut={hideInfo} />
          <p className="card__like-count">{card.likes.length}</p>
        </div>
      </div>
      {isViewAuthorPopupOpen ? (<ViewAuthorPopup card={card} position={popupPosition} />) : ''}
      {isViewLikePopupOpen ? (<ViewLikePopup card={card} position={popupPosition} needUpdateView={needUpdateView} />) : ''}
    </article>
  );
};

export default Card;
