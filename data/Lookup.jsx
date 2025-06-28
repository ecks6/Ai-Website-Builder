export default {
    SUGGSTIONS: ['Create Todo App', 'Create a Budget Track App', 'Create a Login and Signup page',
    "Develop a Task Management App",
    "Create a Fully Responsive Blog Platform",
    "Design a Minimalistic Note-Taking App",
    "Develop a Customizable Landing Page",
    "Develop a Recipe Sharing Platform",
    "Create a Fitness Tracking App",
    "Develop a Personal Finance Management Tool",
    "Create a Language Learning App",
    "Build a Virtual Event Platform",
    "Create a Music Streaming Service"
  ],

    DEFAULT_FILE_REACT: {
        '/public/index.html': {
            code: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>React App</title>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
              <div id="root"></div>
            </body>
            </html>`
        },
        '/App.css': {
            code: `@tailwind base;
            @tailwind components;
            @tailwind utilities;`
        },
        '/tailwind.config.js': {
            code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
        },
        '/postcss.config.js': {
            code: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;`
        }
    },

    DEFAULT_FILE_HTML: {
        '/index.html': {
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Web App</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <header>
        <nav>
            <h1>My Web App</h1>
        </nav>
    </header>
    
    <main>
        <section class="hero">
            <h2>Welcome to My App</h2>
            <p>This is a modern HTML/CSS/JavaScript application.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 My Web App. All rights reserved.</p>
    </footer>
    
    <script src="scripts/main.js"></script>
</body>
</html>`
        },
        '/styles/main.css': {
            code: `/* Modern CSS Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* CSS Custom Properties */
:root {
    --primary-color: #3b82f6;
    --secondary-color: #1e40af;
    --text-color: #1f2937;
    --bg-color: #ffffff;
    --border-radius: 8px;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Base Styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--bg-color);
}

/* Header */
header {
    background: var(--primary-color);
    color: white;
    padding: 1rem 0;
    box-shadow: var(--shadow);
}

nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

nav h1 {
    font-size: 1.5rem;
    font-weight: bold;
}

/* Main Content */
main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.hero {
    text-align: center;
    padding: 4rem 0;
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.hero p {
    font-size: 1.2rem;
    color: #6b7280;
}

/* Footer */
footer {
    background: #f9fafb;
    text-align: center;
    padding: 2rem 0;
    margin-top: 4rem;
    border-top: 1px solid #e5e7eb;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero h2 {
        font-size: 2rem;
    }
    
    .hero p {
        font-size: 1rem;
    }
}`
        },
        '/scripts/main.js': {
            code: `// Modern JavaScript for interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add interactive elements
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('click', function() {
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
});

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Simple animation helper
    animate: function(element, property, from, to, duration = 300) {
        const start = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = from + (to - from) * progress;
            element.style[property] = value + (property.includes('opacity') ? '' : 'px');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
};`
        }
    },

    // Get default files based on environment
    getDefaultFiles: function(environment = 'react') {
        if (environment === 'html') {
            return this.DEFAULT_FILE_HTML;
        }
        return this.DEFAULT_FILE_REACT;
    },

    get DEFAULT_FILE() {
        return this.DEFAULT_FILE_REACT; // Keep backward compatibility
    },

    DEPENDANCY: {
        "@google/generative-ai": "^0.21.0",
        "@heroicons/react": "^1.0.6",
        "@headlessui/react": "^1.7.17",
        "autoprefixer": "^10.0.0",
        "firebase": "^11.1.0",
        "framer-motion": "^10.0.0",
        "lucide-react": "latest",
        "postcss": "^8",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-icons": "^5.0.0",
        "react-router-dom": "latest",
        "react-toastify": "^10.0.0",
        "tailwind-merge": "^2.4.0",
        "tailwindcss": "^3.4.1",
        "tailwindcss-animate": "^1.0.7",
        "uuid4": "^2.0.3",
        "uuidv4": "^6.2.13",
        "uuid": "^11.1.0",
        "@mui/material": "^6.4.6"
    }
}