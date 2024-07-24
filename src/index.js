let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.querySelector("#toy-collection");
  const API = 'http://localhost:3000/toys';
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and render toys
  function fetchToys() {
    fetch(API)
      .then(response => response.json())
      .then(toys => {
        toyCollection.innerHTML = '';
        toys.forEach(renderToy);
      });
  }

  // Render a single toy
  function renderToy(toy) {
    const toyCard = document.createElement('div');
    toyCard.className = 'card';
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(toyCard);
  }

  // Add new toy
  toyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;
    
    fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({name, image, likes: 0})
    })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);
      toyForm.reset();
    });
  });

  // Like a toy
  toyCollection.addEventListener('click', (e) => {
    if (e.target.className === 'like-btn') {
      const id = e.target.dataset.id;
      const likesElement = e.target.previousElementSibling;
      const likes = parseInt(likesElement.textContent) + 1;

      fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({likes})
      })
      .then(response => response.json())
      .then(updatedToy => {
        likesElement.textContent = `${updatedToy.likes} Likes`;
      });
    }
  });

  // Initial fetch of toys
  fetchToys();
});
