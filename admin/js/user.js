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
      //alert('User added successfully!');
      swal("Отлично!", "Вы нажали на кнопку!", "успех")
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