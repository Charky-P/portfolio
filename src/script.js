// Fetch and render blog posts and projects when the page loads, and sorting buttons 
window.addEventListener('DOMContentLoaded', () => {
  if (document.body.id === 'blog-page') {
    // Default sort by Date (descending)
    fetchBlogs('date', 'desc'); 

    // Set up event listeners for sorting buttons
    document.getElementById('sort-blog-date').addEventListener('click', () => {
      const sortOrder = toggleActiveSortButton('sort-blog-date', 'blog');
      fetchBlogs('date', sortOrder);
    });

    document.getElementById('sort-blog-top-rated').addEventListener('click', () => {
      const sortOrder = toggleActiveSortButton('sort-blog-top-rated', 'blog');
      fetchBlogs('rating', sortOrder);
    });
  } else if (document.body.id === 'project-page') {
    // Default sort by Date (descending)
    fetchProjects('date', 'desc');

    // Set up event listeners for sorting buttons
    document.getElementById('sort-project-date').addEventListener('click', () => {
      const sortOrder = toggleActiveSortButton('sort-project-date', 'project');
      fetchProjects('date', sortOrder);
    });

    document.getElementById('sort-project-top-rated').addEventListener('click', () => {
      const sortOrder = toggleActiveSortButton('sort-project-top-rated', 'project');
      fetchProjects('rating', sortOrder);
    });
  }
});

// Load navigation bar and footer
window.addEventListener('DOMContentLoaded', () => {
  // Navigation bar
  const currentPath = window.location.pathname;
  const withinDirectory = currentPath.split('/').length > 2;
  const indexPath = withinDirectory ? '../index.html' : 'index.html';
  const blogPath = withinDirectory ? '../blogs.html' : 'blogs.html';
  const projectPath = withinDirectory ? '../projects.html' : 'projects.html';
  const resourcePath = withinDirectory ? '../resources.html' : 'resources.html';
  const faviconPath = withinDirectory ? '../images/favicon.png' : 'images/favicon.png';

  const navBarHTML = `
  <header>
    <a href="index.html" class="logo">
      <img src="${faviconPath}" alt="Home" class="favicon">
    </a>

    <div class="navigation">
      <a href="${indexPath}" class="page">Home</a>
      <a href="${blogPath}" class="page">Blog</a>
      <a href="${projectPath}" class="page">Projects</a>
      <a href="${resourcePath}" class="page">Resources</a>
    </div>
  </header>
  `;

  document.getElementById('nav-bar').innerHTML = navBarHTML;

  const navLinks = document.querySelectorAll('.navigation a');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath.includes(linkPath)) {
      link.classList.add('current-page');
      link.classList.remove('page');
    } else if (withinDirectory && currentPath.includes('blogs') && linkPath.includes('blogs')) {
      link.classList.add('current-page');
      link.classList.remove('page');
    } else if (withinDirectory && currentPath.includes('projects') && linkPath.includes('projects')) {
      link.classList.add('current-page');
      link.classList.remove('page');
    } else {
      link.classList.remove('current-page');
      link.classList.add('page');
    }
  });

  // Footer
  const footerHTML = `
  <div class="footer-social">
    <ul class="footer-icons">
      <li>
        <a href="https://github.com/charky-p" target="_blank">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" width="30" height="30">
          GitHub
        </a>
      </li>
      <li>
        <a href="https://linkedin.com" target="_blank">
          <img src="https://img.icons8.com/ios/452/linkedin.png" alt="LinkedIn" width="30" height="30">
          LinkedIn
        </a>
      </li>
      <li>
        <a href="gmail.com" target="_blank">
          <img src="https://img.icons8.com/?size=100&id=86840&format=png&color=000000" alt="Email" width="30" height="30">
          Email
        </a>
      </li>
    </ul>
  </div>

  <div class="footer-text">
    &copy; 2024 Charles Podesta
  </div>
  `

  document.getElementById('footer').innerHTML = footerHTML;
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
        <a href="${blog.link}"><img src="${blog.image}" alt="Blog Image"></a>
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
function toggleActiveSortButton(buttonId, type) {
  const buttons = document.querySelectorAll(`.sort-${type}-buttons button`);

  // Check if button was already active then switch arrows
  const active = document.getElementById(buttonId);
  const arrow = document.querySelector(`#${buttonId} .arrow`);
  if (active.classList.contains('active-sort')) {
    if (arrow.innerHTML === String.fromCharCode(8595)) {
      arrow.innerHTML = String.fromCharCode(8593);
    } else {
      arrow.innerHTML = String.fromCharCode(8595);
    }
  }

  buttons.forEach(button => button.classList.remove('active-sort'));
  document.getElementById(buttonId).classList.add('active-sort');
  return arrow.innerHTML === String.fromCharCode(8595) ? 'desc' : 'asc';
}

/**
 * Fetch project data from projects.json
 * 
 * @param { string } sortBy - sort type, for example 'date' or 'rating'
 * @param { string } sortOrder - order of sort for example 'asc' or 'desc'
 * 
 * @returns { null }
 */
function fetchProjects(sortBy, sortOrder) {
  fetch('projects.json').then(response => response.json()).then(data => {
    const sortedProjects = sortProjects(data, sortBy, sortOrder);
    renderProjects(sortedProjects);
  });
}

/**
 * Sort projects according to sortBy and sortOrder
 * 
 * @param { Array } projects - Array of project objects
 * @param { string } sortBy - sort by type, for example 'date' or 'rating'
 * @param { string } sortOrder - sort order for example 'asc' or 'desc'
 * 
 * @returns { Array } - array of sorted project objects 
 */
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

/**
 * Render projects into HTML using project data in an array
 * 
 * @param { Array } projects - Array of project objects
 * 
 * @returns { null } 
 */
function renderProjects(projects) {
  const container = document.getElementById('projects');
  container.innerHTML = '';

  projects.forEach(project => {
    // Generate project data
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');

    projectElement.innerHTML = `
    <a href="${project.link}" class="project-title"><strong>${project.title}</strong></a>
    <div class="project-meta">
        <span class="project-date">${project.date}</span>
        <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
    </div>
    <p class="project-summary">${project.summary}</p>
    <a href="${project.github}" class="project-github" target="_blank">View on Github</a>
    <a href="${project.demo}" class="project-demo" target="_blank">View Demo</a>
    `;

    container.appendChild(projectElement);
  });
}