import React, { useContext, useState, useEffect } from 'react';
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import useFormValidation from "../hooks/useForm";

const EditProfilePopup = ({ isOpen, onClose, onUpdateUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const currentUser = useContext(CurrentUserContext);
  const { values, setValues, handleInputChange, errors, isValid, resetForm } = useFormValidation();

  useEffect(() => {
    resetForm();
    setValues({ ...values, 'name': currentUser.name, 'about': currentUser.about });
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
    onUpdateUser(values)
      .finally(() => {
        setIsLoading(false);
        setIsSubmitDisabled(false);
      });
    resetForm();
  }

  return (
    <PopupWithForm title="Редактировать профиль" name="profile" isOpen={isOpen}
      onClose={onClose} submitDescription={isLoading ? 'Сохранение...' : 'Сохранить'}
      onSubmit={handleSubmit} isSubmitDisabled={isSubmitDisabled}>
      <input value={values.name || ''} type="text" className="popup__edit-field" id="author-name" placeholder="Автор" name="name"
        onChange={handleInputChange}
        minLength="2"
        maxLength="40" required />
      <span id="author-name-error"
        className='popup__input-error popup__input-error_visible'>{errors.name || ''}</span>
      <input value={values.about || ''} type="text" className="popup__edit-field" id="author-specialization" placeholder="О себе"
        onChange={handleInputChange}
        name="about"
        minLength="2" maxLength="200" required />
      <span id="author-specialization-error"
        className='popup__input-error popup__input-error_visible'>{errors.about || ''}</span>
    </PopupWithForm>
  );
};

export default EditProfilePopup;
