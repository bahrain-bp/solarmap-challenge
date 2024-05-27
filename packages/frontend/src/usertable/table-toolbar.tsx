import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../components/iconify';
import { TextField } from '@mui/material';

interface UserTableToolbarProps {
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// ----------------------------------------------------------------------

const UserTableToolbar: React.FC<UserTableToolbarProps> = ({ filterName, onFilterName }) => {
  return (
    <Toolbar
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
      }}
    >
      <TextField
        value={filterName}
        sx={{ mt: 3 }}
        onChange={onFilterName}
        label="Search Category..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Toolbar>
  );
};

export default UserTableToolbar;
