const form = document.querySelector('form');
const audioResult = document.getElementById('audioResult');
const imageResult = document.getElementById('imageResult');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); // Handle the response data
    audioResult.textContent = data.audioResult || 'Audio processing failed';
    imageResult.textContent = data.imageResult || 'Image processing failed';
  })
  .catch(error => {
    console.error('Error:', error);
    audioResult.textContent = 'Error uploading audio file';
    imageResult.textContent = 'Error uploading image file';
  });
});
