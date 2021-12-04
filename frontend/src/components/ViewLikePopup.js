import React, { useEffect, useState } from 'react';
import { formattingUserCount } from "../utils/utils";
import LikeUser from "./LikeUser";

const ViewLikePopup = ({ card, position, needUpdateView }) => {

  const updateView = useState(false);

  useEffect(() => {
    updateView[1](needUpdateView);
  }, [needUpdateView, updateView]);

  return (
    <div className='popup popup_type_view-likes popup_opened' style={position}>
      <h2
        className="popup__header popup__header_size_small">
        {`Оценили: ${card.likes.length} ${formattingUserCount(card.likes.length)}:`}
      </h2>
      <ul className="popup__like-users">
        {card.likes.map(user => {
          return (<LikeUser key={user._id} user={user} />)
        })}
      </ul>
    </div>
  );
};

export default ViewLikePopup;

