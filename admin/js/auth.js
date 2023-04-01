// Инициализация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBrEhYZ-rqOWjz1hvQMBLdNnuidwAxaZeg",
    authDomain: "anmkz-7dbcc.firebaseapp.com",
    projectId: "anmkz-7dbcc",
    storageBucket: "anmkz-7dbcc.appspot.com",
    messagingSenderId: "97098739697",
    appId: "1:97098739697:web:aaa3eef8ac9a8f547d9e50",
    measurementId: "G-VQX2SZ2GQP"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Получение ссылок на элементы формы
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("login");
  const logoutButton = document.getElementById("logout");

  document.addEventListener('DOMContentLoaded', function() {
    // Обработчик нажатия на кнопку "Logout"
logoutButton.addEventListener("click", e => {
    e.preventDefault();
    firebase.auth().signOut().then(() => {
      // Выход из системы успешно выполнен
      console.log("User is logged out");
      window.location.href = "auth.html"; // перенаправление на страницу авторизации
    }).catch(error => {
      // Произошла ошибка при выходе из системы
      console.log(error.message);
    });
  });
  });
  

  // Обработчик нажатия на кнопку "Войти"
  document.addEventListener('DOMContentLoaded', function() {
    // ваш код с методом addEventListener
    loginButton.addEventListener("click", e => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        const auth = firebase.auth();
      
        // Авторизация пользователя
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => console.log(e.message));
      });
  });
  
  
  // Обработчик изменения состояния авторизации
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // Пользователь авторизован
      
      if (window.location.href.indexOf("adminp.html") === -1) {
        console.log("User is logged in");
        window.location.href = "adminp.html";
      } // перенаправление на страницу после авторизации
    } else {
      // Пользователь не авторизован
      
      if (window.location.href.indexOf("auth.html") === -1) {
        console.log("User is logged out");
        window.location.href = "auth.html";
      }
    }
  });


  //добавления пользователя
  const addUserForm = document.getElementById('add-user-form');
const usersTable = document.getElementById('users-table');

addUserForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = addUserForm.name.value;
  const email = addUserForm.email.value;
  const password = addUserForm.password.value;
  const position = addUserForm.position.value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user.updateProfile({
        displayName: name
      });
    })
    .then(() => {
      return firebase.firestore().collection('users').doc(email).set({
        name: name,
        email: email,
        position: position
      });
    })
    .then(() => {
      alert('User added successfully!');
      addUserForm.reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

firebase.firestore().collection('users').get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      const tr = document.createElement('tr');
      const nameTd = document.createElement('td');
      const emailTd = document.createElement('td');
      const positionTd = document.createElement('td');
      const actionsTd = document.createElement('td');
      const resetPasswordButton = document.createElement('button');
      nameTd.textContent = user.name;
      emailTd.textContent = user.email;
      positionTd.textContent = user.position;
      resetPasswordButton.textContent = 'Reset Password';
      resetPasswordButton.classList.add('reset-password-button');
      resetPasswordButton.addEventListener('click', () => {
        firebase.auth().sendPasswordResetEmail(user.email)
          .then(() => {
            alert('Password reset email sent successfully!');
          })
          .catch((error) => {
            console.log(error);
          });
      });
      actionsTd.appendChild(resetPasswordButton);
      tr.appendChild(nameTd);
      tr.appendChild(emailTd);
      tr.appendChild(positionTd);
      tr.appendChild(actionsTd);
      usersTable.querySelector('tbody').appendChild(tr);
    });
  })
  .catch((error) => {
    console.log(error);
  });