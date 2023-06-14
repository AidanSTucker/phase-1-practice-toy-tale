let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  fetchToys();

  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    addNewToy(event.target);
  });

  const newToyButton = document.getElementById("new-toy-btn");
  newToyButton.addEventListener("click", () => {
    toggleFormVisibility();
  });

  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(data => {
        data.forEach(toy => renderToyCard(toy));
      });
  }

  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = toy.id;

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.classList.add("toy-avatar");

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.textContent = "Like ❤️";

    card.append(h2, img, p, likeBtn);
    toyCollection.appendChild(card);
  }

  function addNewToy(form) {
    const name = form.name.value;
    const image = form.image.value;
    const toyData = {
      name,
      image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(toyData)
    })
      .then(response => response.json())
      .then(data => {
        renderToyCard(data);
        form.reset();
        toggleFormVisibility();
      });
  }

  function toggleFormVisibility() {
    toyForm.classList.toggle("hidden");
  }

  toyCollection.addEventListener("click", event => {
    if (event.target.classList.contains("like-btn")) {
      const toyCard = event.target.closest(".card");
      const toyId = toyCard.dataset.id;
      const likesParagraph = toyCard.querySelector("p");
      const currentLikes = parseInt(likesParagraph.textContent);
      const newLikes = currentLikes + 1;

      updateLikes(toyId, newLikes)
        .then(updatedLikes => {
          likesParagraph.textContent = `${updatedLikes} Likes`;
        })
        .catch(error => {
          console.log("Error updating likes:", error);
        });
    }
  });

  function updateLikes(toyId, newLikes) {
    const url = `http://localhost:3000/toys/${toyId}`;

    return fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(response => response.json())
      .then(data => data.likes);
  }
});
