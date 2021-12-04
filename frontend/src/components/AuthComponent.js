import React, { useEffect } from 'react';
import useFormValidation from "../hooks/useForm";

function AuthComponent({ description, submitDescription, onSubmit, children }) {

  const {values, handleInputChange, errors, isValid, resetForm} = useFormValidation();

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
    resetForm();
  }

  return (
    <section className="auth">
      <h2 className="auth-form__header">{description}</h2>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="auth-form__input-label" htmlFor="email">
          <input
            type="email"
            name="email"
            className="auth-form__input"
            placeholder="Email"
            onChange={handleInputChange}
            value={values.email || ''}
            required
          />
          <span id="auth-form__input-error"
            className='auth-form__input-error auth-form__input-error_visible'>{errors.email || ''}</span>
        </label>
        <label className="auth-form__input-label" htmlFor="password">
          <input
            type="password"
            name="password"
            className="auth-form__input"
            placeholder="Пароль"
            onChange={handleInputChange}
            value={values.password || ''}
            required
          />
          <span id="auth-form__input-error"
            className='auth-form__input-error auth-form__input-error_visible'>{errors.password || ''}</span>
        </label>
        <button className={`auth-form__save-button ${isValid ? 'auth-form__save-button_disabled' : ''}`}
          type="submit" aria-label="Сохранить изменения"
          disabled={!isValid}
        >{submitDescription}</button>
      </form>
      {children}
    </section>
  );
}

export default AuthComponent;
