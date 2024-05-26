import React from 'react';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from './utils';

// Define the type for headLabel
interface HeadCell {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  width?: string | number;
  minWidth?: string | number;
}

// Define the props for the component
interface TableMainHeadProps {
  order: 'asc' | 'desc';
  orderBy: string;
  headLabel: HeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
}

const TableMainHead: React.FC<TableMainHeadProps> = ({ order, orderBy, headLabel, onRequestSort }) => {
  const onSort = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={onSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableMainHead;
