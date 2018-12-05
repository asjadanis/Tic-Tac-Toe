export const boxStyles = (row, col) => ({
  width: '5rem', 
  height: '5rem', 
  border: '2px solid', 
  position: 'absolute', 
  left: 6+(col*0.3)+(col*5)+'rem', 
  top: 6+(row*0.3)+(row*5)+'rem', 
  cursor:'pointer',
  transition: 'all 0.3s ease-in-out, border-color ',
  backgroundColor: 'darkcyan',
  textAlign: 'center'
});

export const iconStyles = (row, col, value) => ({
   width: '5rem', 
  height: '5rem',
  position: 'absolute', 
  left: 6+(col*0.3)+(col*5)+'rem', 
  top: 6+(row*0.3)+(row*5)+'rem', 
  zIndex: 1, 
  color: value === 'H' ? 'lawngreen' : 'red'
})