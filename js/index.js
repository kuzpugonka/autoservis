const form = document.querySelector(".form");
const formFieldsets = document.querySelectorAll(".form__fieldset");

const formBtnPrev = document.querySelector(".form__btn_prev");
const formBtnNext = document.querySelector(".form__btn_next");
const formBtnSubmit = document.querySelector(".form__btn_submit");

let currentStep = 0;
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
  } else {
    formBtnPrev.style.display = "";
    formBtnNext.style.display = "";
    formBtnSubmit.style.display = "none";
  }
};

formBtnNext.addEventListener("click", () => {
  if (currentStep < formFieldsets.length - 1) {
    currentStep += 1;
    //  увеличивает на единицу
    updateFielsetVisibility();
  }
});

formBtnPrev.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep -= 1;
    updateFielsetVisibility();
  }
});

updateFielsetVisibility();

formBtnSubmit.addEventListener('click', () => {
  
})
