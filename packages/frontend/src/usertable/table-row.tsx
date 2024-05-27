import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Tooltip } from '@mui/material';

// Define the props interface
interface UserTableRowProps {
    email: string;
    firstName: string;
    lastName: string;
    onClickEdit: () => void;
  onClickDelete: () => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ email, firstName, lastName, onClickEdit, onClickDelete }) => {
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell></TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{firstName}</TableCell>
      <TableCell>{lastName}</TableCell>

      <TableCell align="right">
        <Tooltip title="Edit User">
          <Button
            variant="contained"
            sx={{ ml: 1 }}
            size="small"
            color="primary"
            onClick={() => onClickEdit()}
          >
            <ListAltIcon fontSize="small" />
          </Button>
        </Tooltip>

        <Tooltip title="Delete User">
          <Button
            variant="contained"
            sx={{ ml: 1 }}
            size="small"
            color="error"
            onClick={() => onClickDelete()}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;