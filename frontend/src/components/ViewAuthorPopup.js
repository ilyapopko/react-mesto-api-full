import React from 'react';

const ViewAuthorPopup = ({ card, position }) => {

  return (
    <div className='popup popup_type_view-author popup_opened' style={position}>
      <img className="popup__card-author-avatar" src={card.owner.avatar} alt="Аватарка" />
      <p className="popup__card-author-name">{card.owner.name}</p>
      <p className="popup__card-author-about">{card.owner.about}</p>
    </div>
  );
};

export default ViewAuthorPopup;

