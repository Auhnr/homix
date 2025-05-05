import React, { useState } from "react";
import "./contacts.css";

//отпр сообщ придет прямо на почту а осуществляет formspree


const Contacts = ({ theme }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    // Покажеn сообщение и исчезнет через 5 сек
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className={`contacts-container ${theme}`}>
      <h1 className="contacts-title">Свяжитесь с нами</h1>
      <p className="contacts-description">
        Если у вас есть вопросы или предложения, пожалуйста, заполните форму
        ниже, и мы свяжемся с вами в ближайшее время.
      </p>

      {submitted && (
        <div className="success-message">Сообщение отправлено!</div>
      )}

      <form
        className="contacts-form"
        action="https://formspree.io/f/xeoggzpe"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="name">ФИО</label>
          <input
            type="text"
            name="name"
            placeholder="Введите ваше ФИО"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Электронная почта</label>
          <input
            type="email"
            name="email"
            placeholder="Введите ваш email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Сообщение</label>
          <textarea
            name="message"
            placeholder="Введите ваше сообщение"
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          Отправить
        </button>
      </form>
    </div>
  );
};

export default Contacts;
