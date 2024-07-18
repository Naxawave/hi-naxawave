document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('https://naxawave.github.io/updateSystem-test-v1/cards_.json');
    if (!response.ok) throw new Error('Network response was not ok');

    let cards = await response.json();

    // Actualizar el contador de cartas
    const cardCounter = document.getElementById('cardCounter');
    cardCounter.textContent = `(${cards.length})`;

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    shuffleArray(cards);

    let savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];
    const savedCardsContainer = document.getElementById('savedCardsContainer');
    const showMoreButton = document.getElementById('showMoreTutorialCards');
    const searchInput = document.getElementById('searchTutorials');

    function renderSavedCards() {
      savedCardsContainer.innerHTML = '';

      savedCards.forEach((savedCard) => {
        const savedCardElement = document.createElement('div');
        savedCardElement.classList.add('saved-card');

        savedCardElement.innerHTML = `
          <img src="${savedCard.imgThumbnail}" alt="Thumbnail">
          <h3>${savedCard.cardTitle}</h3>
          <p>${savedCard.authorCard}</p>
        `;

        savedCardElement.addEventListener('click', () => {
          showMoreInfo(savedCard);
        });

        savedCardsContainer.appendChild(savedCardElement);
      });
    }

    renderSavedCards();

    const cardContainer = document.getElementById('tutorials_container');
    const moreInfoContainer = document.querySelector('.openinfo');
    const cardTitle = document.getElementById('cardTitle');
    const authorCard = document.getElementById('authorCard');
    const duration = document.getElementById('duration');
    const cardVideo = document.getElementById('cardVideo');
    const cardImg = document.getElementById('cardImg');
    const cardDescription = document.getElementById('cardDescription');
    const linksContainer = document.querySelector('.buttons_card');
    const body = document.body;
    const category = document.getElementById('category');

    renderCards(cards.slice(0, 10));

    showMoreButton.addEventListener('click', () => {
      if (showMoreButton.classList.contains('show-all')) {
        showMoreButton.classList.remove('show-all');
        renderCards(cards.slice(0, 10));
        showMoreButton.innerHTML = 'Ver Más <i class="ri-arrow-right-line"></i>';
      } else {
        showMoreButton.classList.add('show-all');
        renderCards(cards);
        showMoreButton.innerHTML = 'Ocultar <i class="ri-arrow-left-line"></i>';
      }
    });

    searchInput.addEventListener('input', () => {
      const searchText = searchInput.value.trim().toLowerCase();

      if (searchText === '') {
        renderCards(cards.slice(0, 10));
      } else {
        const filteredCards = cards.filter(card => card.cardCode.toLowerCase() === searchText);

        if (filteredCards.length > 0) {
          renderCards(filteredCards); 
        } else {
          cardContainer.innerHTML = '<p>No se encontraron tarjetas con ese cardCode o titulo, revisa que exista.</p>';
        }
      }
    });

    function renderCards(cardsToRender) {
      cardContainer.innerHTML = '';

      cardsToRender.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('tutorials_cards');

        card.innerHTML = `
         
          <img class="card_img" src="${item.imgThumbnail}" alt="Err - The card could not be loaded correctly"><br>
          <h3 class="card_title">${item.cardTitle}</h3>
          <i class="ri-bookmark-line icon_saved"></i>
        `;

        cardContainer.appendChild(card);

        card.querySelector('.card_img').addEventListener('click', () => {
          showMoreInfo(item);
        });

        updateSaveIcon(card, item);
      });
    }

    function showMoreInfo(item) {
      cardTitle.textContent = item.cardTitle;
      authorCard.textContent = item.authorCard;
      duration.textContent = item.cardVideoDuration;
      cardVideo.href = item.cardLinkVideo;
      cardImg.src = item.imgThumbnail;
      cardDescription.textContent = item.cardDescription;
      cardcode.textContent = item.cardCode;

      linksContainer.innerHTML = '';
      item.links.forEach((link, index) => {
        const linkButton = document.createElement('a');
        linkButton.href = link;
        linkButton.textContent = `Link ${index + 1}`;
        linkButton.classList.add('button_link');
        linksContainer.appendChild(linkButton);
      });

      const saveButton = document.querySelector('.save_button');
      const shareButton = document.querySelector('.share_button');
      const isSaved = savedCards.some(saved => saved.cardCode === item.cardCode);
      if (isSaved) {
        saveButton.classList.add('saved');
        saveButton.innerHTML = `<i class="ri-bookmark-fill"></i> `;
      } else {
        saveButton.classList.remove('saved');
        saveButton.innerHTML = `<i class="ri-bookmark-line"></i> `;
      }

      saveButton.onclick = () => {
        toggleSave(item, saveButton);
      };

      shareButton.onclick = () => {
        navigator.clipboard.writeText(item.cardCode).then(() => {
          const copyModal = document.getElementById('copyAlert');
          copyModal.classList.add('show');
      

          setTimeout(() => {
            copyModal.classList.remove('show');
          }, 2000);
      
        }).catch(err => {
          console.error('Error al copiar el código:', err);
        });
      };

      moreInfoContainer.classList.add('show');
      body.classList.add('no_scroll');
    }

    document.getElementById('closeInfo').addEventListener('click', () => {
      moreInfoContainer.classList.remove('show');
      body.classList.remove('no_scroll');
    });

    function toggleSave(item, saveButton) {
      const savedCardIndex = savedCards.findIndex(saved => saved.cardCode === item.cardCode);

      if (savedCardIndex !== -1) {
        savedCards.splice(savedCardIndex, 1);
        saveButton.classList.remove('saved');
        saveButton.innerHTML = `<i class="ri-bookmark-line"></i> `;
      } else {
        item.cardSaved = true;
        savedCards.push(item);
        saveButton.classList.add('saved');
        saveButton.innerHTML = `<i class="ri-bookmark-fill"></i> `;
      }

      localStorage.setItem('savedCards', JSON.stringify(savedCards));

      renderSavedCards();
      updateSaveIcon(saveButton.closest('.tutorials_cards'), item);
    }

    function updateSaveIcon(card, item) {
      const iconSaved = card.querySelector('.icon_saved');
      const isSaved = savedCards.some(saved => saved.cardCode === item.cardCode);

      if (isSaved) {
        iconSaved.classList.remove('ri-bookmark-line');
        iconSaved.classList.add('ri-bookmark-fill');
      } else {
        iconSaved.classList.remove('ri-bookmark-fill');
        iconSaved.classList.add('ri-bookmark-line');
      }
    }
  } catch (error) {
    
    const tutorialAlert = document.getElementById('msgTutorials');
    tutorialAlert.classList.add('show');
    
    console.error('Error al cargar el archivo JSON:', error);
  }
});