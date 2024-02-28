import { fetchData } from "./fetchData.js";

const form = document.querySelector(".form");
const formTime = document.querySelector(".form__time");
const formFieldsetType = document.querySelector(".form__fieldset_type");
const formFieldsetDate = document.querySelector(".form__fieldset_date");
const formFieldsetClient = document.querySelector(".form__fieldset_client");
const formFieldsets = [formFieldsetType, formFieldsetDate, formFieldsetClient];

const formBtnPrev = document.querySelector(".form__btn_prev");
const formBtnNext = document.querySelector(".form__btn_next");
const formBtnSubmit = document.querySelector(".form__btn_submit");

const typeRadioWrapper = document.querySelector(".form__radio-wrapper_type");
const dayRadioWrapper = document.querySelector(".form__radio-wrapper_day");
const timeRadioWrapper = document.querySelector(".form__radio-wrapper_time");
const formMonthsWrapper = document.querySelector(".form__months");
const formInfoType = document.querySelector(".form__info_type");
const formInfoDate = document.querySelector(".form__info-date");

const currentMonth = new Intl.DateTimeFormat("re-RU", { month: "long" }).format(
  new Date()
);
let month = currentMonth;
let currentStep = 0;

const data = await fetchData();
console.log("data: ", data);
const dataToWrite = {
  dataType: {},
  day: "",
  time: "",
};

const createRadioBtns = (wrapper, name, data) => {
  wrapper.textContent = "";

  data.forEach((item) => {
    const radioDiv = document.createElement("div");
    radioDiv.className = "radio";

    const radioInput = document.createElement("input");
    radioInput.className = "radio__input";
    radioInput.type = "radio";
    radioInput.name = name;
    radioInput.id = item.value;
    radioInput.value = item.value;

    const radioLabel = document.createElement("label");
    radioLabel.className = "radio__label";
    radioLabel.htmlFor = item.value;
    radioLabel.textContent = item.title;

    radioDiv.append(radioInput, radioLabel);
    wrapper.append(radioDiv);
  });
};

const allMonth = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

//  <p class="form__info form__info_type">Диагностика и&nbsp;ремонт двигателей</p>
// <p class="form__info">
// <time class="form__info-date" time-datetime="2024-03-02T14:00">

// </time>
// </p>

const showResultData = () => {
  const currentYear = new Date().getFullYear();
  const monthIndex = allMonth.findIndex((item) => item === month);
  const dateString = `${currentYear}-${(monthIndex + 1)
    .toString()
    .padStart(2, "0")}-${dataToWrite.day.toString().padStart(2, "0")}T${
    dataToWrite.time
  }`;

  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });

  formInfoType.textContent = dataToWrite.dataType.title;
  formInfoDate.innerHTML = `
      <span class="form__info-date_day">${formattedDate}</span>
      <span class="form__info-date_time">${dataToWrite.time}</span>
    `;
  formInfoDate.dateTime = dateString;
};

const updateFielsetVisibility = () => {
  for (let i = 0; i < formFieldsets.length; i++) {
    if (i === currentStep) {
      formFieldsets[i].classList.add("form__fieldset_active");
    } else {
      formFieldsets[i].classList.remove("form__fieldset_active");
    }
  }

  if (currentStep === 0) {
    formBtnPrev.style.display = "none";
    formBtnNext.style.display = "";
    formBtnSubmit.style.display = "none";
  } else if (currentStep === formFieldsets.length - 1) {
    formBtnPrev.style.display = "";
    formBtnNext.style.display = "none";
    formBtnSubmit.style.display = "";

    showResultData();
  } else {
    formBtnPrev.style.display = "";
    formBtnNext.style.display = "";
    formBtnSubmit.style.display = "none";
  }
};

const createFormTime = (date, day) => {
  const objectMonth = date.find((item) => item.month === month);
  const days = objectMonth.day;
  const daysData = days[day].map((item) => ({
    value: `${item}:00`,
    title: `${item}:00`,
  }));
  createRadioBtns(timeRadioWrapper, "time", daysData);
  formTime.style.display = "block";
};

const createFormDay = (date) => {
  const objectMonth = date.find((item) => item.month === month);
  const days = Object.keys(objectMonth.day);
  const typeData = days.map((item) => ({
    value: item,
    title: item,
  }));

  createRadioBtns(dayRadioWrapper, "day", typeData);
};

const createFormMonth = (months) => {
  formMonthsWrapper.textContent = "";
  const buttonsMonth = months.map((item) => {
    const btn = document.createElement("button");
    btn.className = "form__btn-month";
    btn.type = "button";
    // делаем заглавную букву
    btn.textContent = `${item[0].toUpperCase()}${item
      .substring(1)
      .toLowerCase()}`;

    if (item === month) {
      btn.classList.add("form__btn-month_active");
    }

    return btn;
  });

  formMonthsWrapper.append(...buttonsMonth);

  buttonsMonth.forEach((btn) => {
    btn.addEventListener("click", ({ target }) => {
      if (target.classList.contains("form__btn-month_active")) {
        return;
      }
      buttonsMonth.forEach((btn) => {
        btn.classList.remove("form__btn-month_active");
      });

      target.classList.add("form__btn-month_active");

      month = target.textContent.toLowerCase();

      const date = data.find(
        (item) => item.type === dataToWrite.dataType.type
      ).date;

      createFormDay(date);
    });
  });
};

//  определяем стоит ли значение
const handleInputForm = ({ currentTarget, target }) => {
  if (currentTarget.type.value && currentStep === 0) {
    formBtnNext.disabled = false;

    const typeObj = data.find((item) => item.type === currentTarget.type.value);

    dataToWrite.dataType.type = typeObj.type;
    dataToWrite.dataType.title = typeObj.title;

    const date = typeObj.date;
    const months = date.map((item) => item.month);

    createFormMonth(months);
    createFormDay(date);
  }

  if (currentStep === 1) {
    if (currentTarget.day.value && target.name === "day") {
      dataToWrite.day = currentTarget.day.value;
      const date = data.find(
        (item) => item.type === dataToWrite.dataType.type
      ).date;
      createFormTime(date, dataToWrite.day);
    }
    if (
      currentTarget.day.value &&
      currentTarget.time.value &&
      target.name === "time"
    ) {
      dataToWrite.time = currentTarget.time.value;
      formBtnNext.disabled = false;
    } else {
      formBtnNext.disabled = true;
    }
  }

  if (currentStep === 2) {
    const inputs = formFieldsetClient.querySelectorAll(".form__input");
    let allFilled = true;

    inputs.forEach((input) => {
      // вместо этого условия можно написать функцию валидации и проверки
      if (input.value.trim() === "") {
        allFilled = false;
      }
    });

    formBtnSubmit.disabled = !allFilled;
  }
};

const renderTypeFieldset = () => {
  const typeData = data.map((item) => ({
    value: item.type,
    title: item.title,
  }));

  createRadioBtns(typeRadioWrapper, "type", typeData);
};

const init = () => {
  formBtnNext.disabled = true;

  formBtnNext.addEventListener("click", () => {
    if (currentStep < formFieldsets.length - 1) {
      currentStep += 1; //  увеличивает на единицу
      updateFielsetVisibility();
      formBtnNext.disabled = true;
      formBtnSubmit.disabled = true;
    }
  });

  formBtnPrev.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep -= 1;
      updateFielsetVisibility();
      formBtnNext.disabled = false;
    }
  });

  form.addEventListener("change", handleInputForm);

  updateFielsetVisibility();
  renderTypeFieldset();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const formDataObject = Object.fromEntries(formData);
    formDataObject.month = month;
    console.log("formDataObject: ", formDataObject);

    try {
      const response = await fetch(
        "https://fresh-large-space.glitch.me/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataObject),
        }
      );

      if (response.ok) {
        alert("Данные успешно отправлены");
        form.innerHTML = "<h2>Данные успешно отправлены</h2>";
      } else {
        throw new Error(`Ошибка при отправке данных: ${response.status}`);
      }
    } catch (error) {
      console.error(`Ошибка при отправке запроса: ${error}`);
    }
  });
};

init();
