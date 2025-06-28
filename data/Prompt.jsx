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
    REACT_CODE_GEN_PROMPT: dedent`
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

    Here's the reformatted and improved version of your prompt:

    Generate a programming code structure for a React project using Vite.
    Do not create a App.jsx file. There is a App.js file in the project structure, rewrite it.
    Use Tailwind css for styling. Create a well Designed UI. 

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

    Ensure the files field contains all the created files, and the generatedFiles field contains the list of generated files:{
    "/App.js": {
      "code": "import React from 'react';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;\n"
    }
    }
    
    Also updaate the Package.json file with the needed dependencies.

    Additionally, include an explanation of the project's structure, purpose, and additional instructions:
    - For placeholder images use appropirate URLs.
    - Add external images if needed.
    - The lucide-react library is also available to be imported IF NECESSARY.
    - Update the package.json file with the required dependencies.
    - Do not use backend or database related.
    `,

    // HTML-specific prompts
    HTML_CODE_GEN_PROMPT: dedent`
    Generate a fully structured HTML/CSS/JavaScript project.
    Create a modern, responsive website using pure HTML, CSS, and JavaScript.

    **Project Requirements:**
    - Use **semantic HTML5** structure
    - Create **modern CSS** with custom properties and flexbox/grid
    - Add **interactive JavaScript** functionality
    - Use **responsive design** principles
    - Organize files into logical structure (/styles, /scripts, /images)
    - Include **CSS animations** and **hover effects**
    - Use **modern JavaScript ES6+** features
    - Create **mobile-first** responsive design

    **Styling Guidelines:**
    - Use CSS custom properties (CSS variables)
    - Implement modern CSS features (flexbox, grid, transforms)
    - Add smooth transitions and animations
    - Use proper typography and spacing
    - Implement dark/light theme support if applicable

    **JavaScript Guidelines:**
    - Use modern ES6+ syntax
    - Add interactive elements and animations
    - Implement smooth scrolling and page transitions
    - Add form validation if forms are present
    - Use event delegation and proper DOM manipulation

    **Image Handling:**
    - Use royalty-free image sources (Pexels, Pixabay)
    - Implement proper image optimization
    - Add lazy loading for images

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

    Ensure the files field contains all created files with proper HTML/CSS/JS structure.
    Create a professional, modern website with clean code and best practices.
    `,

    // Environment-specific enhance prompts
    REACT_ENHANCE_PROMPT_RULES: dedent`
    You are a React development expert and prompt enhancement specialist. Your task is to improve the given user prompt for React projects by:
    1. Making it more specific for React development
    2. Including React-specific requirements (components, hooks, state management)
    3. Adding modern React patterns and best practices
    4. Specifying Tailwind CSS styling requirements
    5. Including component architecture suggestions
    6. Adding interactive features using React hooks
    7. Mentioning responsive design with Tailwind classes
    8. Keep it focused on frontend React development only
    9. Keep it under 300 words

    Return only the enhanced prompt as plain text without any JSON formatting or additional explanations.
    `,

    HTML_ENHANCE_PROMPT_RULES: dedent`
    You are an HTML/CSS/JavaScript expert and prompt enhancement specialist. Your task is to improve the given user prompt for pure HTML projects by:
    1. Making it more specific for HTML/CSS/JavaScript development
    2. Including modern CSS features (flexbox, grid, custom properties)
    3. Adding JavaScript interactivity requirements
    4. Specifying responsive design principles
    5. Including CSS animations and transitions
    6. Adding semantic HTML structure requirements
    7. Mentioning accessibility best practices
    8. Keep it focused on frontend web development only
    9. Keep it under 300 words

    Return only the enhanced prompt as plain text without any JSON formatting or additional explanations.
    `,

    // Get appropriate prompts based on environment
    getCodeGenPrompt: function(environment) {
        return environment === 'html' ? this.HTML_CODE_GEN_PROMPT : this.REACT_CODE_GEN_PROMPT;
    },

    getEnhancePromptRules: function(environment) {
        return environment === 'html' ? this.HTML_ENHANCE_PROMPT_RULES : this.REACT_ENHANCE_PROMPT_RULES;
    },

    // Legacy support
    get CODE_GEN_PROMPT() {
        return this.REACT_CODE_GEN_PROMPT;
    },

    get ENHANCE_PROMPT_RULES() {
        return this.REACT_ENHANCE_PROMPT_RULES;
    }
}