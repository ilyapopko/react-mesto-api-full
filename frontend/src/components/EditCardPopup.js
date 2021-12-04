import React, { useEffect, useState } from 'react';
import PopupWithForm from "./PopupWithForm";
import useFormValidation from "../hooks/useForm";

const EditCardPopup = ({ isOpen, onClose, onSaveCard, card }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const { values, setValues, handleInputChange, errors, isValid, resetForm } = useFormValidation();

  useEffect(() => {
    resetForm();
    if (card) {
      setValues({ ...values, 'name': card.name});
      setIsSubmitDisabled(false);
    }
    // eslint-disable-next-line
  }, [resetForm, isOpen, card]);

  useEffect(() => {
    setIsSubmitDisabled(!isValid);
    // eslint-disable-next-line
  }, [isValid]);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitDisabled(true);
    onSaveCard(values, card)
      .finally(() => {
        setIsLoading(false);
        setIsSubmitDisabled(false);
      });
    resetForm();
  }

  return (
    <PopupWithForm title='Редактирование места' name="edit-card" isOpen={isOpen}
      onClose={onClose}
      submitDescription={isLoading ? 'Сохранение...' : 'Сохранить'}
      onSubmit={handleSubmit}
      isSubmitDisabled={isSubmitDisabled}>
      <input value={values.name || ''} type="text" className="popup__edit-field" id="place-name" placeholder="Название" name="name"
        minLength="2" maxLength="30" required onChange={handleInputChange} />
      <span id="place-name-error"
        className='popup__input-error popup__input-error_visible'>{errors.name || ''}</span>
    </PopupWithForm>
  );
};

export default EditCardPopup;
