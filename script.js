// Fetch and render blog posts when the page loads
window.addEventListener('DOMContentLoaded', () => {
  if (document.body.id === 'blog-page') {
    // Default sort by Date (descending)
    fetchBlogs('date', 'desc'); 

    // Set up event listeners for sorting buttons
    document.getElementById('sort-blog-date').addEventListener('click', () => {
      const sortOrder = toggleActiveButton('sort-blog-date', 'blog');
      fetchBlogs('date', sortOrder);
    });

    document.getElementById('sort-blog-top-rated').addEventListener('click', () => {
      const sortOrder = toggleActiveButton('sort-blog-top-rated', 'blog');
      fetchBlogs('rating', sortOrder);
    });
  } else if (document.body.id === 'project-page') {
    // Default sort by Date (descending)
    fetchProjects('date', 'desc');

    // Set up event listeners for sorting buttons
    document.getElementById('sort-project-date').addEventListener('click', () => {
      const sortOrder = toggleActiveButton('sort-project-date', 'project');
      fetchProjects('date', sortOrder);
    });

    document.getElementById('sort-project-top-rated').addEventListener('click', () => {
      const sortOrder = toggleActiveButton('sort-project-top-rated', 'project');
      fetchProjects('rating', sortOrder);
    });
  }
});

window.addEventListener('DOMContentLoaded', () => {

});

/**
 * Fetch blog data from blogs.json then sort and render it
 * 
 * @param { string } sortBy - sortBy category, for example 'date' or 'rating' 
 * @param { string } sortOrder - sortOrder either 'asc' (ascending) or 'dsc' descending
 * 
 * @returns { null } 
 */
function fetchBlogs(sortBy, sortOrder) {
  fetch('blogs.json').then(response => response.json()).then(data => {
    const sortedBlogs = sortBlogs(data, sortBy, sortOrder);
    renderBlogs(sortedBlogs);
  });
}

/**
 * Sort blogs according to a condition
 * 
 * @param { Array } blogs - Array of blogs 
 * @param { string } sortBy - sortBy category, for example 'date' or 'rating' 
 * @param { string } sortOrder - sortOrder either 'asc' (ascending) or 'dsc' descending
 * 
 * @returns { Array } - Array of sorted blogs
 */
function sortBlogs(blogs, sortBy, sortOrder) {
  return blogs.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'rating') {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
  });
}

/**
 * Render blogs by updating the HTML data
 * 
 * @param { Array } blogs - Array of blogs to be rendered
 * 
 * @returns { null } 
 */
function renderBlogs(blogs) {
  const container = document.getElementById('blog-posts');
  container.innerHTML = '';

  blogs.forEach(blog => {
    // Generate blog data
    const blogElement = document.createElement('div');
    blogElement.classList.add('blog-post');

    blogElement.innerHTML = `
        <img src="${blog.image}" alt="Blog Image">
          <div>
            <a href="${blog.link}" class="blog-title"><strong>${blog.title}</strong></a>
            <div class="blog-meta">
                <span class="blog-date">${blog.date}</span>
                <div class="blog-tags">
                    ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <p class="blog-summary">${blog.summary}</p>
        </div>
    `;

    container.appendChild(blogElement);
  });
}

/**
 * Toggle a button to be active for the sorting buttons of the blog posts
 * 
 * @param { string } buttonId - the button Id of what to sort
 * @param { string } type - type of button, for example blog or project
 * 
 * @returns { string } - 'desc' or 'asc' depending on the arrow representing the sorting order 
 */
function toggleActiveButton(buttonId, type) {
  const buttons = document.querySelectorAll(`.sort-${type}-buttons button`);

  // Check if button was already active then switch arrows
  const active = document.getElementById(buttonId);
  const arrow = document.querySelector(`#${buttonId} .arrow`);
  if (active.classList.contains('active')) {
    if (arrow.innerHTML === String.fromCharCode(8595)) {
      arrow.innerHTML = String.fromCharCode(8593);
    } else {
      arrow.innerHTML = String.fromCharCode(8595);
    }
  }

  buttons.forEach(button => button.classList.remove('active'));
  document.getElementById(buttonId).classList.add('active');
  return arrow.innerHTML === String.fromCharCode(8595) ? 'desc' : 'asc';
}

function fetchProjects(sortBy, sortOrder) {
  fetch('projects.json').then(response => response.json()).then(data => {
    const sortedProjects = sortProjects(data, sortBy, sortOrder);
    renderProjects(sortedProjects);
  });
}

function sortProjects(projects, sortBy, sortOrder) {
  return projects.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'rating') {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
  });
}

function renderProjects(projects) {
  const container = document.getElementById('projects');
  container.innerHTML = '';

  projects.forEach(project => {
    // Generate project data
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');

    projectElement.innerHTML = `
          <div>
            <a href="${project.link}" class="project-title"><strong>${project.title}</strong></a>
            <div class="project-meta">
                <span class="project-date">${project.date}</span>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <p class="project-summary">${project.summary}</p>
            <a href="${project.github}" class="project-github">View on Github</a>
            <a href="${project.demo}" class="project-demo">View Demo</a>
    `;

    container.appendChild(projectElement);
  });
}