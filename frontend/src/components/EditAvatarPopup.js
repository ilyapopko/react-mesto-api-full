import React, { useContext, useEffect, useState } from 'react';
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import useFormValidation from "../hooks/useForm";

const EditAvatarPopup = ({ isOpen, onClose, onUpdateAvatar }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const currentUser = useContext(CurrentUserContext);
  const { values, setValues, handleInputChange, errors, isValid, resetForm } = useFormValidation();

  useEffect(() => {
    resetForm();
    setValues({ ...values, 'link': currentUser.avatar });
    setIsSubmitDisabled(false);
    // eslint-disable-next-line
  }, [resetForm, isOpen, currentUser]);

  useEffect(() => {
    setIsSubmitDisabled(!isValid);
    // eslint-disable-next-line
  }, [isValid]);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitDisabled(true);
    onUpdateAvatar(values.link)
      .finally(() => {
        setIsLoading(false);
        setIsSubmitDisabled(false);
      });
    resetForm();
  }

  return (
    <PopupWithForm title="Обновить аватар" name="avatar" isOpen={isOpen}
      onClose={onClose} submitDescription={isLoading ? 'Сохранение...' : 'Сохранить'}
      onSubmit={handleSubmit} isSubmitDisabled={isSubmitDisabled}>
      <input type="url" value={values.link || ''} className="popup__edit-field" id="avatar-link" name="link"
        onChange={handleInputChange}
        placeholder="Ссылка на картинку"
        required />
      <span id="avatar-link-error"
        className='popup__input-error popup__input-error_visible'>{errors.link || ''}</span>
    </PopupWithForm>
  );
};

export default EditAvatarPopup;
