/*=============== CARDS GENERATOR ===============*/
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('https://naxawave.github.io/updateSystem-test-v1/news_.json');
    const data = await response.json();

    const newsContainer = document.getElementById('newsContainer');

    // Limit to show only the first 10 news
    data.slice(0, 10).forEach(news => {
      // Get the truncated or full description
      const description = news.newsDescription.length > 20 ?
        `${news.newsDescription.slice(0, 40)}...` :
        news.newsDescription;

      const card = document.createElement('div');
      card.classList.add('news_card');

      card.innerHTML = `
        <div class="news_content">
          <h6 class="news_date">${news.newsDate}</h6>
          <h2 class="news_header">${news.newsTitle}</h2>
          <hr>
          <h5 class="news_description_card">${description}</h5>
        </div>
        <div class="news_img">
          <img src="${news.imgThumbnail}">
        </div>
      `;

      // Event to open the modal
      card.querySelector('.news_img img').addEventListener('click', () => {
        const modal = document.getElementById('NewsWin');
        const modalImg = modal.querySelector('.window_news_img img');
        const modalTitle = modal.querySelector('.text_news');
        const modalContent = modal.querySelector('.content_news');
        const modalDate = modal.querySelector('.news_date');
        const openButton = modal.querySelector('.open_news_button');

        modalImg.src = news.imgThumbnail;
        modalTitle.textContent = news.newsTitle;
        modalContent.textContent = news.newsDescription;
        modalDate.textContent = news.newsDate;

        // Set the link for the "Open" button
        openButton.addEventListener('click', () => {
          window.location.href = news.links;
        });

        modal.style.display = 'flex'; // Show the modal
      });

      newsContainer.appendChild(card);
    });

    // Close the modal when the "Close" button is clicked
    const closeModalBtn = document.querySelector('.close_news_button');
    closeModalBtn.addEventListener('click', () => {
      const modal = document.getElementById('NewsWin');
      modal.style.display = 'none'; // Hide the modal
    });

  } catch (error) {
    
    const tutorialAlert = document.getElementById('msgNews');
    tutorialAlert.classList.add('show');

    console.error('Error loading the JSON file:', error);
  }
});