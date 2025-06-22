document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');
    const requiredFields = ['companyName', 'name', 'email', 'inquiryType'];

    const validationRules = {
        email: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '有効なメールアドレスを入力してください。'
        },
        phone: {
            regex: /^(0[5-9]0[ -]?\d{4}[ -]?\d{4}|0\d{1,4}[ -]?\d{1,4}[ -]?\d{4})$/,
            message: '有効な電話番号を入力してください。'
        }
    };

    const getFieldElement = (name) => document.getElementById(name);
    const getErrorMessageElement = (field) => field.nextElementSibling;

    const showValidationError = (field, message) => {
        field.classList.add('border-red-500');
        let errorElement = getErrorMessageElement(field);
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('p');
            errorElement.className = 'error-message text-red-500 text-xs mt-1';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        errorElement.textContent = message;
    };

    const clearValidationError = (field) => {
        field.classList.remove('border-red-500');
        const errorElement = getErrorMessageElement(field);
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = '';
        }
    };

    const validateField = (field) => {
        const fieldName = field.id;
        const value = field.value.trim();
        let isValid = true;

        clearValidationError(field);

        if (requiredFields.includes(fieldName) && !value) {
            showValidationError(field, 'この項目は必須です。');
            isValid = false;
        } else if (validationRules[fieldName] && value && !validationRules[fieldName].regex.test(value)) {
            showValidationError(field, validationRules[fieldName].message);
            isValid = false;
        }
        
        return isValid;
    };

    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        contactForm.querySelectorAll('input, select').forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            formStatus.textContent = '入力内容にエラーがあります。ご確認ください。';
            formStatus.className = 'text-red-500 mt-4';
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = '送信中...';
        formStatus.textContent = '';
        formStatus.className = '';

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        const gasUrl = contactForm.dataset.gasUrl;

        try {
            const response = await fetch(gasUrl, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                redirect: 'follow'
            });
            
            formStatus.textContent = 'お問い合わせありがとうございます。送信が完了しました。';
            formStatus.className = 'text-green-500 mt-4';
            contactForm.reset();
            contactForm.querySelectorAll('input, select, textarea').forEach(clearValidationError);

        } catch (error) {
            console.error('Error:', error);
            formStatus.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
            formStatus.className = 'text-red-500 mt-4';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = '送信する';
        }
    });
});
