import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

type PostSortOption = {
  value: string;
  label: string;
};

type PostSortProps = {
  options: PostSortOption[];
  onSort: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PostSort({ options, onSort }: PostSortProps) {
  return (
    <TextField select size="small" value="latest" onChange={onSort}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

PostSort.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSort: PropTypes.func.isRequired,
};
