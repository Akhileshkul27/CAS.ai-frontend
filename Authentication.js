// const scriptURL = 'https://script.google.com/macros/s/AKfycbwAJUmfIYGtJLmxb_Lr4RLOBzlZTg_tcrb0fkiYrGzOiR_nanYWNVw01Re1UCd-w9iftg/exec';
// const form = document.forms['contact-form'];

// form.addEventListener('submit', e => {
//   e.preventDefault();

//   const userPhoneNumber = form['Phone Number'].value.trim();
//   console.log('User entered phone number:', userPhoneNumber);

//   fetch(`${scriptURL}?action=getPhoneNumbers`)
//     .then(response => response.json())
//     .then(data => {
//       const phoneNumbers = data.phoneNumbers.map(num => String(num).trim());
//       console.log('Phone numbers in the sheet:', phoneNumbers);

//       const existingNumber = phoneNumbers.includes(userPhoneNumber);
//       console.log('Does number exist?', existingNumber);

//       if (existingNumber) {
//         alert('Phone number already exists!');
//       } else {
//         fetch(scriptURL, {
//           method: 'POST',
//           body: new FormData(form)
//         })
//           .then(response => response.json())
//           .then(data => {
//             if (data.result === 'success') {
//               alert('Thank you! Your form has been submitted successfully.');
//               window.location.reload();
//             } else if (data.result === 'error' && data.message) {
//               alert(data.message);
//             }
//           })
//           .catch(error => {
//             console.error('Error:', error);
//             alert('Something went wrong. Please try again later.');
//           });
//       }
//     })
//     .catch(error => {
//       console.error('Error fetching phone numbers:', error);
//       alert('Something went wrong. Please try again later.');
//     });
// });

const scriptURL = 'https://script.google.com/macros/s/AKfycbwAJUmfIYGtJLmxb_Lr4RLOBzlZTg_tcrb0fkiYrGzOiR_nanYWNVw01Re1UCd-w9iftg/exec';
const form = document.forms['contact-form'];

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  spinner.style.display = 'flex'; // Show the spinner
  const userName = form['Name'].value.trim();
  const userPhoneNumber = form['Phone Number'].value.trim();
  const userEmail = form['Email Address'].value.trim();

  // Validate phone number (10-digit numeric only)
  const phoneNumberPattern = /^\d{10}$/;
  if (!phoneNumberPattern.test(userPhoneNumber)) {
    alert('Please enter a valid 10-digit phone number.');
    spinner.style.display = 'none'; // Hide spinner after response
    return;
  }

  try {
    const response = await fetch(`${scriptURL}?action=getPhoneNumbers`);
    const data = await response.json();

    const phoneNumbers = data.phoneNumbers.map(num => String(num).trim());
    if (phoneNumbers.includes(userPhoneNumber)) {
      alert('Already Registered, Welcome to Chaitanya Aditya Solar!');
      window.location.href = 'home.html'; // Redirect to index.html
      return;
    }

    // Submit form if validation passes
    const formData = new FormData(form);
    const postResponse = await fetch(scriptURL, {
      method: 'POST',
      body: formData
    });

    const postData = await postResponse.json();
    if (postData.result === 'success') {
      alert('Thank you! Registered successfully.');
      window.location.href = 'home.html'; // Redirect on success
      // form.reset();
    } else {
      alert(postData.message || 'Unexpected error occurred.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again later.');
  }
  finally {
    spinner.style.display = 'none'; // Hide spinner after response
  }
});
