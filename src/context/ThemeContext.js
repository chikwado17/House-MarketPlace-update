import React, { createContext, useState, useEffect } from 'react'


export const ThemeContext = createContext();

const ThemeContextProvider = ({children}) => {

    const [isLightTheme, setIsLightTheme] = useState(
      localStorage.getItem('dark-mode') === 'true'
    );


    useEffect(() => {

      localStorage.setItem('dark-mode', isLightTheme);
      
    }, [isLightTheme])

    const handleThemeToggle = () => {
        setIsLightTheme(!isLightTheme);
    }


  return (
    <ThemeContext.Provider value={{isLightTheme, handleThemeToggle:handleThemeToggle }}>
        {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider