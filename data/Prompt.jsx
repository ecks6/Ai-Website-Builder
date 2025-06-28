import dedent from 'dedent';

export default {
    // React Prompts
    CHAT_PROMPT_REACT: dedent`
    'You are an AI Assistant and experienced in React Development.
    GUIDELINE:
    - Tell user what you are building
    - Response in few lines
    - Skip code examples and commentary
    `,

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

    ENHANCE_PROMPT_RULES_REACT: dedent`
    You are a prompt enhancement expert and React website designer. Your task is to improve the given user prompt by:
    1. Making it more specific and detailed for React development
    2. Including clear React-specific requirements and constraints
    3. Maintaining the original intent of the prompt
    4. Using clear and precise language
    5. Adding specific React UI/UX requirements if applicable:
    - Responsive React components with hooks
    - Modern React patterns (functional components, hooks)
    - Component composition and reusability
    - State management with useState/useEffect
    - Interactive elements with event handlers
    - Smooth animations with framer-motion
    6. Don't use backend or database related features
    7. Keep it less than 300 words
    8. Focus on React ecosystem and best practices

    Return only the enhanced prompt as plain text without any JSON formatting or additional explanations.
    `,

    // HTML Prompts
    CHAT_PROMPT_HTML: dedent`
    'You are an AI Assistant and experienced in HTML/CSS/JavaScript Development.
    GUIDELINE:
    - Tell user what you are building with vanilla HTML/CSS/JS
    - Response in few lines
    - Skip code examples and commentary
    `,

    CODE_GEN_PROMPT_HTML: dedent`
    Generate a fully structured HTML project with modern vanilla JavaScript.
    Ensure the project follows best practices in web development and modern HTML5 standards.

    **Project Requirements:**
    - Use **HTML5** semantic elements
    - Use **CSS3** with modern features (Grid, Flexbox, Custom Properties)
    - Use **Vanilla JavaScript** (ES6+) for interactivity
    - Create a modern, visually appealing UI with responsive design
    - Organize files properly (HTML, CSS, JS separation)
    - Include interactive elements and animations
    - Use modern CSS techniques and animations

    **Styling Guidelines:**
    - Use CSS Grid and Flexbox for layouts
    - Implement CSS custom properties (variables)
    - Add smooth transitions and hover effects
    - Create responsive design with media queries
    - Use modern CSS features like backdrop-filter, clip-path

    **JavaScript Guidelines:**
    - Use ES6+ features (arrow functions, destructuring, modules)
    - Implement modern DOM manipulation
    - Add event listeners for interactivity
    - Use async/await for any asynchronous operations
    - Follow modern JavaScript best practices

    Return the response in JSON format with the following schema:
    {
      "projectTitle": "",
      "explanation": "",
      "files": {
        "/index.html": {
          "code": ""
        },
        "/style.css": {
          "code": ""
        },
        "/script.js": {
          "code": ""
        },
        ...
      },
      "generatedFiles": []
    }

    Ensure the files field contains all the created files with proper HTML structure.
    
    Additionally, include an explanation of the project's structure, purpose, and additional instructions:
    - Use semantic HTML5 elements
    - Implement modern CSS techniques
    - Add interactive JavaScript features
    - Ensure responsive design
    - Use external images from appropriate sources if needed
    - Do not use any frameworks or libraries
    - Focus on vanilla web technologies
    `,

    ENHANCE_PROMPT_RULES_HTML: dedent`
    You are a prompt enhancement expert and vanilla HTML/CSS/JavaScript website designer. Your task is to improve the given user prompt by:
    1. Making it more specific and detailed for vanilla web development
    2. Including clear HTML/CSS/JavaScript requirements and constraints
    3. Maintaining the original intent of the prompt
    4. Using clear and precise language
    5. Adding specific vanilla web UI/UX requirements if applicable:
    - Semantic HTML5 structure
    - Modern CSS with Grid/Flexbox layouts
    - Vanilla JavaScript interactivity
    - CSS animations and transitions
    - Responsive design with media queries
    - Progressive enhancement principles
    6. Don't use any frameworks or libraries
    7. Keep it less than 300 words
    8. Focus on modern vanilla web technologies

    Return only the enhanced prompt as plain text without any JSON formatting or additional explanations.
    `,

    // Utility function to get the right prompt
    getPrompt: function(promptType, environment) {
        const envSuffix = environment === 'HTML' ? '_HTML' : '_REACT';
        const promptKey = promptType + envSuffix;
        return this[promptKey] || this[promptType + '_REACT']; // fallback to React
    }
}