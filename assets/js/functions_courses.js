document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('https://naxawave.github.io/updateSystem-test-v1/courses_.json');
    const data = await response.json();

    const coursesContainer = document.getElementById('coursesContainer');

    // Limitando a mostrar solo los primeros 10 cursos
    data.slice(0, 1).forEach(course => {
      const card = document.createElement('div');
      card.classList.add('course');

      card.innerHTML = `
              <div class="course_img">
                  <img src="${course.imgThumbnail}" alt="Err - La tarjeta no se pudo cargar correctamente">
              </div>
              <div class="course_info">
                  <h4 class="course_title">${course.courseTitle}</h4>
                   <p class="course_lessons">${course.courseDuration} Hrs</p><hr>
                   <p class="course_duration">${course.courseLessons} Lecciones</p>
              </div>
              `;

      coursesContainer.appendChild(card);

      card.querySelector('.course_img img').addEventListener('click', () => {
        window.location.href = course.courseLink;
      });
    });

  } catch (error) {
  
  const coursesAlert = document.getElementById('msgCourses');
  coursesAlert.classList.add('show');

    console.error('Error al cargar el archivo JSON:', error);
  }
});