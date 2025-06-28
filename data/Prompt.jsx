import dedent from 'dedent';

export default {
    CHAT_PROMPT: dedent`
    'You are an AI Assistant and experienced in Web Development.
    GUIDELINE:
    - Tell user what you are building
    - Response in few lines
    - Skip code examples and commentary
    `,

    // React-specific prompts
    CODE_GEN_PROMPT_REACT: dedent`
    Generate a fully structured React project using Vite.  
Ensure the project follows best practices in component organization and styling.  

**Project Requirements:**  
- Use **React** as the framework.  
- Add as many functional features as possible.  
- **Do not create an App.jsx file. Use App.js instead** and modify it accordingly.  
- Use **Tailwind CSS** for styling and create a modern, visually appealing UI.  
- Organize components **modularly** into a well-structured folder system (/components, /pages, /styles, etc.).  
- Include reusable components like **buttons, cards, and forms** where applicable.  
- Use **lucide-react** icons if needed for UI enhancement.  
- Do not create a src folder.

**Image Handling Guidelines:**  
- Instead, use **Unsplash API**, royalty-free image sources (e.g., Pexels, Pixabay).
- Do not use images from unsplash.com.
- use images from the internet.

**Dependencies to Use:**  
- "postcss": "^8"  
- "tailwindcss": "^3.4.1"  
- "autoprefixer": "^10.0.0"  
- "uuid4": "^2.0.3"  
- "tailwind-merge": "^2.4.0"  
- "tailwindcss-animate": "^1.0.7"  
- "lucide-react": "latest"  
- "react-router-dom": "latest"  
- "firebase": "^11.1.0"  
- "@google/generative-ai": "^0.21.0"  
- "@headlessui/react": "^1.7.17"  
- "framer-motion": "^10.0.0"  
- "react-icons": "^5.0.0"  
- "uuid": "^11.1.0"  
- "@mui/material": "^6.4.6"  

    Return the response in JSON format with the following schema:
    {
      "projectTitle": "",
      "explanation": "",
      "files": {
        "/App.js": {
          "code": ""
        },
        ...
      },
      "generatedFiles": []
    }

    Generate a programming code structure for a React project using Vite.
    Do not create a App.jsx file. There is a App.js file in the project structure, rewrite it.
    Use Tailwind css for styling. Create a well Designed UI. 

    Ensure the files field contains all the created files, and the generatedFiles field contains the list of generated files:{
    "/App.js": {
      "code": "import React from 'react';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;\n"
    }
    }
    
    Also update the Package.json file with the needed dependencies.

    Additionally, include an explanation of the project's structure, purpose, and additional instructions:
    - For placeholder images use appropriate URLs.
    - Add external images if needed.
    - The lucide-react library is also available to be imported IF NECESSARY.
    - Update the package.json file with the required dependencies.
    - Do not use backend or database related.
    `,

    // HTML-specific prompts
    CODE_GEN_PROMPT_HTML: dedent`
    Generate a fully structured HTML/CSS/JavaScript project.
    Create a modern, responsive website using vanilla web technologies.

    **Project Requirements:**
    - Use **HTML5** semantic elements
    - Use **CSS3** with modern features (Grid, Flexbox, Custom Properties)
    - Use **Vanilla JavaScript** for interactivity
    - Use **Tailwind CSS** via CDN for rapid styling
    - Create a responsive, mobile-first design
    - Include smooth animations and transitions
    - Organize files in a clean structure (/styles, /scripts, /images)

    **Styling Guidelines:**
    - Use Tailwind CSS classes for layout and components
    - Add custom CSS for unique animations and effects
    - Implement CSS Grid and Flexbox for layouts
    - Use CSS Custom Properties for theming
    - Ensure cross-browser compatibility

    **JavaScript Guidelines:**
    - Use modern ES6+ features
    - Implement smooth scrolling and animations
    - Add interactive elements (forms, modals, sliders)
    - Use event delegation for performance
    - Include utility functions for common tasks

    **Image Handling:**
    - Use royalty-free images from Pexels, Pixabay, or similar
    - Optimize images for web performance
    - Use appropriate alt text for accessibility

    Return the response in JSON format with the following schema:
    {
      "projectTitle": "",
      "explanation": "",
      "files": {
        "/index.html": {
          "code": ""
        },
        "/styles/main.css": {
          "code": ""
        },
        "/scripts/main.js": {
          "code": ""
        },
        ...
      },
      "generatedFiles": []
    }

    Create a well-structured HTML project with modern web standards.
    Include proper semantic HTML, responsive CSS, and interactive JavaScript.
    Do not use any frameworks or libraries except Tailwind CSS via CDN.
    `,

    // Enhanced prompt rules for different environments
    ENHANCE_PROMPT_RULES_REACT: dedent`
    You are a prompt enhancement expert specializing in React development. Your task is to improve the given user prompt by:
    1. Making it more specific for React/Vite projects
    2. Including React-specific requirements (components, hooks, state management)
    3. Adding modern React patterns and best practices
    4. Specifying UI/UX requirements with component structure
    5. Including specific React libraries and dependencies
    6. Mentioning responsive design with React components
    7. Keep it focused on frontend React development
    8. Keep it less than 300 words

    Example enhancements for React:
    - Component-based architecture with reusable components
    - React hooks for state management (useState, useEffect, useContext)
    - Responsive navigation with React Router
    - Interactive forms with validation using React
    - Modern UI components with Tailwind CSS
    - Smooth animations with Framer Motion
    - Icon integration with Lucide React

    Return only the enhanced prompt as plain text without any JSON formatting or additional explanations.
    `,

    ENHANCE_PROMPT_RULES_HTML: dedent`
    You are a prompt enhancement expert specializing in vanilla web development. Your task is to improve the given user prompt by:
    1. Making it more specific for HTML/CSS/JavaScript projects
    2. Including modern web standards and semantic HTML
    3. Adding CSS Grid, Flexbox, and modern CSS features
    4. Specifying vanilla JavaScript interactivity
    5. Including responsive design principles
    6. Mentioning accessibility and performance
    7. Keep it focused on vanilla web technologies
    8. Keep it less than 300 words

    Example enhancements for HTML:
    - Semantic HTML5 structure with proper elements
    - CSS Grid and Flexbox for responsive layouts
    - Vanilla JavaScript for smooth interactions
    - CSS animations and transitions
    - Mobile-first responsive design
    - Cross-browser compatibility
    - Performance optimization techniques
    - Accessibility features (ARIA, alt text, keyboard navigation)

    Return only the enhanced prompt as plain text without any JSON formatting or additional explanations.
    `,

    // Generic enhance prompt rules (backward compatibility)
    ENHANCE_PROMPT_RULES: dedent`
    You are a prompt enhancement expert and website designer. Your task is to improve the given user prompt by:
    1. Making it more specific and detailed
    2. Including clear requirements and constraints
    3. Maintaining the original intent of the prompt
    4. Using clear and precise language
    5. Adding specific UI/UX requirements if applicable
    6. Don't use backend or database related features
    7. Keep it less than 300 words

    Return only the enhanced prompt as plain text without any JSON formatting or additional explanations.
    `,

    // Get the appropriate code generation prompt based on environment
    getCodeGenPrompt: function(environment = 'react') {
        if (environment === 'html') {
            return this.CODE_GEN_PROMPT_HTML;
        }
        return this.CODE_GEN_PROMPT_REACT;
    },

    // Get the appropriate enhance prompt rules based on environment
    getEnhancePromptRules: function(environment = 'react') {
        if (environment === 'html') {
            return this.ENHANCE_PROMPT_RULES_HTML;
        }
        return this.ENHANCE_PROMPT_RULES_REACT;
    },

    // Keep backward compatibility
    get CODE_GEN_PROMPT() {
        return this.CODE_GEN_PROMPT_REACT;
    }
}