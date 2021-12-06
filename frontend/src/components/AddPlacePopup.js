import React, { useEffect, useState } from 'react';
import PopupWithForm from "./PopupWithForm";
import useFormValidation from "../hooks/useForm";

const AddPlacePopup = ({ isOpen, onClose, onSaveCard }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const { values, handleInputChange, errors, isValid, resetForm } = useFormValidation();

  useEffect(() => {
    resetForm();
    // eslint-disable-next-line
    setIsSubmitDisabled(true);
  }, [resetForm, isOpen]);

  useEffect(() => {
    setIsSubmitDisabled(!isValid);
    // eslint-disable-next-line
  }, [isValid]);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitDisabled(true);
    onSaveCard(values)
      .finally(() => {
        setIsLoading(false);
        setIsSubmitDisabled(false);
      });
    resetForm();
  }

  return (
    <PopupWithForm title='Новое место' name="edit-card" isOpen={isOpen}
      onClose={onClose}
      submitDescription={isLoading ? 'Добавление...' : 'Добавить' }
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}>
      <input value={values.name || ''} type="text" className="popup__edit-field" id="place-name" placeholder="Название" name="name"
        minLength="2" maxLength="30" required onChange={handleInputChange} />
      <span id="place-name-error"
        className='popup__input-error popup__input-error_visible'>{errors.name || ''}</span>
      <input value={values.link || ''} type="url" className="popup__edit-field" id="place-link" placeholder="Ссылка на картинку"
        name="link"
        required onChange={handleInputChange} />
      <span id="place-link-error"
        className='popup__input-error popup__input-error_visible' >{errors.link || ''}</span>
    </PopupWithForm>
  );
};

export default AddPlacePopup;
