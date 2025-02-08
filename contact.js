document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const errorSummary = document.getElementById('form-error-summary');
    const phoneInput = document.getElementById('phone');
    const submitButton = document.querySelector('.submit-button');
    const loadingIcon = document.querySelector('.loading-icon');


    phoneInput.addEventListener('blur', function(event) {
         let value = event.target.value.replace(/[^0-9]/g, '');
        let formattedValue = '';

        if (value.startsWith('0120') || value.startsWith('0800')) {
              if (value.length <= 4) {
                  formattedValue = value;
              } else if (value.length <= 8) {
                   formattedValue = value.slice(0, 4) + '-' + value.slice(4);
              }else if (value.length <= 12){
                   formattedValue = value.slice(0, 4) + '-' + value.slice(4,8) + '-' + value.slice(8);
              }else {
                 formattedValue = value.slice(0, 4) + '-' + value.slice(4, 8) + '-' + value.slice(8,12);
              }

        } else if (value.startsWith('0')) {
               if (value.length <= 3) {
                  formattedValue = value;
             } else if (value.length <= 7) {
                 formattedValue = value.slice(0, 3) + '-' + value.slice(3);
             }else if(value.length <= 10){
                  formattedValue = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7)
             } else {
                   formattedValue = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
             }


        } else {
              formattedValue = value;
        }

        event.target.value = formattedValue;
    });


    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        submitButton.disabled = true;
        loadingIcon.style.display = 'inline-block';

        resetErrors();

        let isValid = true;
        let errors = [];


        isValid &= validateRequired('sei', '姓は必須です', errors);
        isValid &= validateRequired('mei', '名は必須です', errors);
        isValid &= validateRequired('sei_kana', 'セイは必須です', errors);
        isValid &= validateRequired('mei_kana', 'メイは必須です', errors);
        isValid &= validateRequired('email', 'メールアドレスは必須です', errors);
        isValid &= validateRequired('email_confirm', '確認用メールアドレスは必須です', errors);
        isValid &= validateRequired('phone', '電話番号は必須です', errors);
        isValid &= validateRequired('message', 'お問い合わせ内容は必須です', errors);



        const email = document.getElementById('email').value;
        const emailConfirm = document.getElementById('email_confirm').value;
        isValid &= validateEmail('email', email, errors);
        isValid &= validateEmailConfirm('email', 'email_confirm', emailConfirm, errors);


        const phone = document.getElementById('phone').value;
        isValid &= validatePhone('phone', phone, errors);


        isValid &= validateKana('sei_kana', 'セイ', errors);
        isValid &= validateKana('mei_kana', 'メイ', errors);


        if (!isValid) {
            displayErrorSummary(errors);
             focusOnError();
            submitButton.disabled = false;
            loadingIcon.style.display = 'none';
            return;
        }


        try {
          await new Promise(resolve => {
                setTimeout(() => {
                   form.submit();
                  resolve();
                }, 1000);
              });
        } finally {
            loadingIcon.style.display = 'none';
            submitButton.disabled = false;
        }
    });

    function validateRequired(id, message, errors) {
         const input = document.getElementById(id);
        if (!input.value) {
             displayError(id, message);
            errors.push({id: id, message: message});
            return false;
         } else {
            clearError(id);
             return true;
         }
     }

    function validateEmail(id, email, errors) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(email)) {
            displayError(id, 'メールアドレスの形式が正しくありません。');
            errors.push({id: id, message: 'メールアドレスの形式が正しくありません。'});
            return false;
        } else {
             clearError(id);
            return true;
        }
    }


    function validateEmailConfirm(emailId, emailConfirmId, emailConfirm, errors) {
        const email = document.getElementById(emailId).value;
        if (email !== emailConfirm) {
            displayError(emailConfirmId, 'メールアドレスが一致しません。');
            errors.push({id: emailConfirmId, message:'メールアドレスが一致しません。'});
            return false;
        } else {
            clearError(emailConfirmId);
            return true;
        }
    }

     function validatePhone(id, phone, errors) {
         let phoneRegex;
           if (phone.startsWith('0120') || phone.startsWith('0800')) {
               phoneRegex = /^[0-9]{4}-[0-9]{2,4}-[0-9]{3,4}$/;
            } else if (phone.startsWith('0')) {
               phoneRegex = /^[0-9]{2,3}-[0-9]{2,4}-[0-9]{3,4}$/;
         } else {
              phoneRegex = /^[0-9]{2,4}-[0-9]{2,4}-[0-9]{3,4}$/;
         }
          if (!phoneRegex.test(phone)) {
              displayError(id, '電話番号の形式が正しくありません。例：090-1234-5678');
              errors.push({id:id, message: '電話番号の形式が正しくありません。例：090-1234-5678'});
              return false;
          } else {
              clearError(id);
              return true;
          }
     }



    function validateKana(id, fieldName, errors) {
        const input = document.getElementById(id).value;
        const kanaRegex = /^[ァ-ヶー]+$/;
        if (!kanaRegex.test(input)) {
           displayError(id, fieldName + 'は全角カタカナで入力してください。');
            errors.push({id:id, message: fieldName + 'は全角カタカナで入力してください。'});
            return false;
        } else {
            clearError(id);
            return true;
        }
    }


   function displayError(id, message) {
       const errorDiv = document.getElementById(id + '-error');
       errorDiv.textContent = message;
       const input = document.getElementById(id);
       input.classList.add('error');
       input.setAttribute('aria-invalid', 'true');
   }

   function clearError(id) {
       const errorDiv = document.getElementById(id + '-error');
       errorDiv.textContent = '';
       const input = document.getElementById(id);
       input.classList.remove('error');
       input.removeAttribute('aria-invalid');
   }

    function displayErrorSummary(errors) {
        errorSummary.style.display = 'block';
        errorSummary.innerHTML = '<strong>入力内容に誤りがあります:</strong><br>' + errors.map(error => `<span data-target="${error.id}" class="error-link">${error.message}</span>`).join('<br>');

        const errorLinks = document.querySelectorAll('.error-link');
         errorLinks.forEach(link => {
             link.addEventListener('click', function() {
                 const targetId = this.getAttribute('data-target');
                 const targetElement = document.getElementById(targetId);
                 targetElement.focus();
                   targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
           });
         });
    }

    function resetErrors() {
        errorSummary.style.display = 'none';
        errorSummary.innerHTML = '';
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(errorMessage => {
            errorMessage.textContent = '';
        });

        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(errorInput => {
            errorInput.classList.remove('error');
             errorInput.removeAttribute('aria-invalid');
        });
    }

   function focusOnError() {
        const firstError = document.querySelector('input.error, textarea.error');
         if (firstError) {
             firstError.focus();
             firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
   }
});
