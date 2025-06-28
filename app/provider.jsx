"use client"
import React, { useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Header from '@/components/custom/Header';
import { MessagesContext } from '@/context/MessagesContext';
import { AIModelProvider } from '@/context/AIModelContext';

function Provider({children}) {
  const [messages,setMessages]=useState();
  return (
    <div>
      <AIModelProvider>
        <MessagesContext.Provider value={{messages,setMessages}}>
          <NextThemesProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem 
              disableTransitionOnChange
              >
                <Header />
              {children}
          </NextThemesProvider>
        </MessagesContext.Provider>
      </AIModelProvider>
    </div>
  );
}

export default Provider;