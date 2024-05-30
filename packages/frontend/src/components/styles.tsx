import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Styled components for Scrollbar
export const StyledRootScrollbar = styled('div')({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
});

export const StyledScrollbar = styled(Box)({
  flexGrow: 1,
  height: '100%',
  overflow: 'auto', // Changed from hidden to auto
  '&::-webkit-scrollbar': {
    width: '0.4em',
    height: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
});
