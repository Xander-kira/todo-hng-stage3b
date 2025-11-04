import React, { useContext } from 'react';
import styled, { DefaultTheme } from 'styled-components/native';
import { ThemeContext } from '../app/_layout';


const Button = styled.Pressable`
  padding: 10px 14px;
  background-color: ${({theme}: {theme: DefaultTheme})=>theme.colors.card};
  border-radius: 12px;
  border: 1px solid ${({theme}: {theme: DefaultTheme})=>theme.colors.border};
`;
const Txt = styled.Text` color: ${({theme}: {theme: DefaultTheme})=>theme.colors.text}; font-weight: 600;`;

export default function ThemeToggle(){
  const { mode, toggle } = useContext(ThemeContext);
 
  return (
    
      <Button onPress={toggle} accessibilityLabel="Toggle theme">
        <Txt>{mode==='light'?'🌞 Light':'🌙 Dark'} mode</Txt>
      </Button>
   
  );
}


