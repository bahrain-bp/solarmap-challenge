import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CircularProgress from '@mui/material/CircularProgress';
import { Tooltip } from '@mui/material';

// Define the props interface
interface UserTableRowProps {
  email: string;
  firstName: string;
  lastName: string;
  verified: string;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  actionLoading?: boolean; // New prop for loading state
}

const UserTableRow: React.FC<UserTableRowProps> = ({ email, firstName, lastName, verified, onClickEdit, onClickDelete, actionLoading }) => {
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell></TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{firstName}</TableCell>
      <TableCell>{lastName}</TableCell>
      <TableCell>{verified}</TableCell>
      <TableCell align="right">
        <Tooltip title="Edit User">
          <Button
            variant="contained"
            sx={{ ml: 1 }}
            size="small"
            color="primary"
            onClick={onClickEdit}
            disabled={!onClickEdit || actionLoading} // Disable if loading
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
            onClick={onClickDelete}
            disabled={!onClickDelete || actionLoading} // Disable if loading
          >
            {actionLoading ? <CircularProgress size={24} /> : <DeleteIcon fontSize="small" />}
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
