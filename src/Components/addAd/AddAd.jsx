import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addAd } from "../../api/ads";
import "./addAd.css";

const AddAd = ({ theme }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "",
    purpose: "продажа", // по умолчанию будет стоять "продажа"
    rent_period: "", // показывает только если purpose = "аренда"
    city: "",
    district: "",
    address: "",
    area: "",
    land_area: "",
    land_unit: "соток", // по умолчанию  будет стоять "соток"
    rooms: "",
    floor: "",
    total_floors: "",
  });
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Вы должны войти в систему, чтобы добавить объявление.");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value || "" }); // Убедимся что значение не становится undefined
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files.map((file) => file.name));
    setImages(e.target.files);
  };

  // Вспомогательная функция для рендера группы полей
  const renderFormGroup = (
    label,
    id,
    name,
    value,
    onChange,
    type = "text",
    options = null
  ) => {
    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        {options ? (
          <select id={id} name={name} value={value} onChange={onChange}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
          />
        )}
      </div>
    );
  };

  // Вспомогательная функция для проверки обязательных полей
  const validateRequiredFields = (formData) => {
    const requiredFields = ["title", "price", "type", "city"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Пожалуйста, заполните поле: ${field}`);
        return false;
      }
    }
    if (Number(formData.price) > 9999999999.99) {
      alert("Цена не может превышать 9 999 999 999.99.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Проверка обязательных полей
    if (!validateRequiredFields(formData)) {
      return;
    }

    // Создаем новый объект FormData
    const formDataToSend = new FormData();

    // Добавляем поля в FormData, исключая ненужные для определенных типов
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (
        (formData.type === "Квартира" ||
          formData.type === "Коммерческая недвижимость") &&
        (key === "land_area" || key === "land_unit")
      ) {
        return; // Пропускаем поля land_area и land_unit для этих типов
      }
      if (value !== undefined && value !== null && value !== "") {
        formDataToSend.append(key, value);
      }
    });

    // Добавляем изображения
    Array.from(images).forEach((file) => {
      formDataToSend.append("images", file);
    });

    // Логирование отправляемых данных
    console.log(
      "Отправляемые данные:",
      Object.fromEntries(formDataToSend.entries())
    );

    // Отправляем данные на сервер
    try {
      await addAd(token, formDataToSend);
      alert("Объявление успешно добавлено!");
      navigate("/ads");
    } catch (err) {
      console.error("Ошибка при добавлении объявления:", err);
      alert(err.response?.data?.message || "Ошибка при добавлении объявления");
    }
  };

  return (
    <div className={`add-ad-container ${theme}`}>
      <h1 className={`add-ad-title ${theme}`}>Добавить объявление</h1>
      <form className="add-ad-form" onSubmit={handleSubmit}>
        {renderFormGroup(
          "Заголовок",
          "title",
          "title",
          formData.title,
          handleChange
        )}
        {renderFormGroup(
          "Описание",
          "description",
          "description",
          formData.description,
          handleChange,
          "textarea"
        )}
        {renderFormGroup(
          "Цена",
          "price",
          "price",
          formData.price,
          handleChange,
          "number"
        )}
        {renderFormGroup(
          "Тип недвижимости",
          "type",
          "type",
          formData.type,
          handleChange,
          "select",
          [
            { value: "", label: "Выберите тип" },
            { value: "Квартира", label: "Квартира" },
            { value: "Дом", label: "Дом" },
            {
              value: "Коммерческая недвижимость",
              label: "Коммерческая недвижимость",
            },
            { value: "Земельный участок", label: "Земельный участок" },
          ]
        )}
        {formData.type === "Квартира" ||
        formData.type === "Коммерческая недвижимость" ||
        formData.type === "Дом"
          ? renderFormGroup(
              "Площадь (м²)",
              "area",
              "area",
              formData.area,
              handleChange,
              "number"
            )
          : null}
        {formData.type === "Земельный участок" || formData.type === "Дом" ? (
          <>
            {renderFormGroup(
              "Площадь участка",
              "land_area",
              "land_area",
              formData.land_area,
              handleChange,
              "number"
            )}
            {renderFormGroup(
              "Единица измерения земли",
              "land_unit",
              "land_unit",
              formData.land_unit,
              handleChange,
              "select",
              [
                { value: "соток", label: "Соток" },
                { value: "га", label: "Гектар" },
              ]
            )}
          </>
        ) : null}
        {renderFormGroup(
          "Цель объявления",
          "purpose",
          "purpose",
          formData.purpose,
          handleChange,
          "select",
          [
            { value: "продажа", label: "Продажа" },
            { value: "аренда", label: "Аренда" },
          ]
        )}
        {formData.purpose === "аренда" &&
          renderFormGroup(
            "Период аренды",
            "rent_period",
            "rent_period",
            formData.rent_period,
            handleChange,
            "select",
            [
              { value: "", label: "Выберите период" },
              { value: "в сутки", label: "В сутки" },
              { value: "в месяц", label: "В месяц" },
            ]
          )}
        {renderFormGroup("Город", "city", "city", formData.city, handleChange)}
        {renderFormGroup(
          "Район",
          "district",
          "district",
          formData.district,
          handleChange
        )}
        {renderFormGroup(
          "Адрес",
          "address",
          "address",
          formData.address,
          handleChange
        )}
        {renderFormGroup(
          "Количество комнат",
          "rooms",
          "rooms",
          formData.rooms,
          handleChange,
          "number"
        )}
        {renderFormGroup(
          "Этаж",
          "floor",
          "floor",
          formData.floor,
          handleChange,
          "number"
        )}
        {renderFormGroup(
          "Всего этажей",
          "total_floors",
          "total_floors",
          formData.total_floors,
          handleChange,
          "number"
        )}
        <div className="form-group">
          <label htmlFor="images" className="file-upload-label">
            Выбрать файл
          </label>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            onChange={handleImageChange}
          />
          {selectedFiles.length > 0 && (
            <ul className="file-upload-list">
              {selectedFiles.map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className={`add-add-btn ${theme}`}>
          Опубликовать
        </button>
      </form>
    </div>
  );
};

export default AddAd;
