const formContainer = document.getElementById('form-container');

const registrationFormHTML = `
    <h2>Регистрация</h2>
    <form id="registration-form">
        <input type="text" id="reg-username" placeholder="Имя пользователя" required>
        <input type="email" id="reg-email" placeholder="Email" required>
        <input type="password" id="reg-password" placeholder="Пароль" required>
        <button type="submit">Зарегистрироваться</button>
    </form>
    <button id="show-login">Уже есть аккаунт? Войти</button>
`;

const loginFormHTML = `
    <h2>Вход</h2>
    <form id="login-form">
        <input type="text" id="login-username-email" placeholder="Имя пользователя или Email" required>
        <input type="password" id="login-password" placeholder="Пароль" required>
        <button type="submit">Войти</button>
    </form>
    <button id="show-registration">Нет аккаунта? Зарегистрироваться</button>
`;

formContainer.innerHTML = registrationFormHTML;

window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        window.location.href = '/dashboard'; 
    } else {
        formContainer.innerHTML = loginFormHTML;
        attachFormEventListeners(); 
    }
});

function attachFormEventListeners() {
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const showLoginButton = document.getElementById('show-login');
    const showRegistrationButton = document.getElementById('show-registration');

    if (registrationForm) {
        registrationForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = registrationForm.querySelector('#reg-username').value;
            const email = registrationForm.querySelector('#reg-email').value;
            const password = registrationForm.querySelector('#reg-password').value;

            if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
                alert('Пожалуйста, заполните все поля.');
                return;
            }

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    body: JSON.stringify({ username, email, password }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const userData = await response.json();
                    alert('Регистрация прошла успешно!');
                    loginAfterRegistration(userData); 
                } else {
                    const errorData = await response.json();
                    alert(`Ошибка регистрации: ${errorData.message || 'Неизвестная ошибка'}`);
                }
            } catch (error) {
                alert(`Ошибка: ${error.message}`);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const usernameOrEmail = loginForm.querySelector('#login-username-email').value;
            const password = loginForm.querySelector('#login-password').value;

            if (usernameOrEmail.trim() === '' || password.trim() === '') {
                alert('Пожалуйста, заполните все поля.');
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    body: JSON.stringify({ usernameOrEmail, password }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const userData = await response.json();
                    alert('Вход выполнен успешно!');

                  
                    localStorage.setItem('user', JSON.stringify(userData));

                    
                    window.location.href = '/dashboard'; 
                } else {
                    const errorData = await response.json();
                    alert(`Ошибка входа: ${errorData.message || 'Неизвестная ошибка'}`);
                }
            } catch (error) {
                alert(`Ошибка: ${error.message}`);
            }
        });
    }

    if (showLoginButton) {
        showLoginButton.addEventListener('click', () => {
            formContainer.innerHTML = loginFormHTML;
            attachFormEventListeners();
        });
    }

    if (showRegistrationButton) {
        showRegistrationButton.addEventListener('click', () => {
            formContainer.innerHTML = registrationFormHTML;
            attachFormEventListeners();
        });
    }
}

attachFormEventListeners();
