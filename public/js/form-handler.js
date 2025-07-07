document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = '送信中...';
        formStatus.textContent = '';
        formStatus.className = '';

        const formData = new FormData(contactForm);
        const data = {
            companyName: formData.get('companyName'),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            inquiryType: formData.get('inquiryType'),
            message: formData.get('message'),
        };

        // Basic validation
        if (!data.companyName || !data.name || !data.email || !data.inquiryType) {
            formStatus.textContent = '必須項目をすべて入力してください。';
            formStatus.className = 'text-red-500 mt-4';
            submitButton.disabled = false;
            submitButton.textContent = '送信する';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            formStatus.textContent = '有効なメールアドレスを入力してください。';
            formStatus.className = 'text-red-500 mt-4';
            submitButton.disabled = false;
            submitButton.textContent = '送信する';
            return;
        }

        const gasUrl = 'https://script.google.com/macros/s/AKfycbzy7ML1OtN3oi2IQ6eL-CvE9cS4_PBvCkZOgELYzdpLBYbso-GlnkZMER0674rw8Ut6/exec';

        try {
            const response = await fetch(gasUrl, {
                method: 'POST',
                mode: 'no-cors', // Important for sending to Google Apps Script from a different origin
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                redirect: 'follow'
            });
            
            // Since mode is 'no-cors', we can't read the response. We assume success if the request doesn't throw an error.
            formStatus.textContent = 'お問い合わせありがとうございます。送信が完了しました。';
            formStatus.className = 'text-green-500 mt-4';
            contactForm.reset();

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
