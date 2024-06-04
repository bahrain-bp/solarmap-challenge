import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Alert } from '@mui/material';
import UserTableToolbar from '../usertable/table-toolbar';
import UserTableRow from '../usertable/table-row';
import TableNoData from '../usertable/table-no-data';
import TableMainHead from '../usertable/table-head';
import TableEmptyRows from '../usertable/table-empty-rows';
import { emptyRows, getComparator } from '../usertable/utils';
import { applyFilter } from '../usertable/filterUtil';
import Scrollbar from '../components/scrollbar';
import { Table, TableBody, TableContainer, TablePagination, CircularProgress, Box, Typography } from '@mui/material';
import solarprovider from '../assets/usermanagement.jpg';
import pattern from '../assets/pattern.png';
import { fetchUserAttributes } from '@aws-amplify/auth';

interface User {
  Username: string;
  Attributes: {
    Name: string;
    Value: string;
  }[];
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false); // New state for action loading

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await fetchUserAttributes();
        const email = data.email;
        setCurrentUserEmail(email || null);
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setFormError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setActionLoading(true); // Start loading

    try {
      const url = `${import.meta.env.VITE_API_URL}/users`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(isEditing ? 'Failed to update user' : 'Failed to create user');
      }

      setFormSuccess(isEditing ? 'User updated successfully' : 'User created successfully');
      setFormData({
        email: '',
        firstName: '',
        lastName: ''
      });

      // Refresh the user list
      const updatedUsersResponse = await fetch(`${import.meta.env.VITE_API_URL}/users`);
      const updatedUsers = await updatedUsersResponse.json();
      setUsers(updatedUsers);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setFormError(isEditing ? 'Failed to update user' : 'Failed to create user');
    } finally {
      setActionLoading(false); // End loading
    }
  };

  const handleEditClick = (user: User) => {
    setFormData({
      email: user.Attributes.find((attr) => attr.Name === 'email')?.Value || '',
      firstName: user.Attributes.find((attr) => attr.Name === 'given_name')?.Value || '',
      lastName: user.Attributes.find((attr) => attr.Name === 'family_name')?.Value || '',
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = async (email: string) => {
    setActionLoading(true); // Start loading
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
  
      setFormSuccess('User deleted successfully');
  
      // Refresh the user list
      const updatedUsersResponse = await fetch(`${import.meta.env.VITE_API_URL}/users`);
      const updatedUsers = await updatedUsersResponse.json();
      setUsers(updatedUsers);
    } catch (err) {
      console.error(err);
      setFormError('Failed to delete user');
    } finally {
      setActionLoading(false); // End loading
    }
  };
  

  // table vars
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // table functions
  const handleSort = (_event: React.MouseEvent<unknown>, id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Box sx={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
        <img
          src={solarprovider}
          alt="User Management"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(70%) blur(3px)',
            borderRadius: '0'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            User Management
          </Typography>
          <Typography variant="h6">
            Manage users effectively with our user management system.
          </Typography>
        </Box>
      </Box>
      <Box sx={{ background: `url(${pattern})`, backgroundSize: 'cover', backgroundPosition: 'center', py: 8, marginTop: '-4px', flex: 1 }}>
        <div className="container">
          <button className="btn btn-primary mb-3" onClick={() => { setShowForm(true); setIsEditing(false); }}>
            Add User
          </button>
          <Dialog open={showForm} onClose={() => setShowForm(false)}>
            <form onSubmit={handleSubmit}>
              <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{ readOnly: isEditing }} // Correct way to use readOnly
                />

                <TextField
                  margin="dense"
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  type="text"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  margin="dense"
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  type="text"
                  fullWidth
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowForm(false)} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={actionLoading}>
                  {actionLoading ? <CircularProgress size={24} /> : isEditing ? 'Update User' : 'Add User'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          <Snackbar
            open={!!formError || !!formSuccess}
            autoHideDuration={6000}
            onClose={() => { setFormError(null); setFormSuccess(null); }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert
              onClose={() => { setFormError(null); setFormSuccess(null); }}
              severity={formError ? 'error' : 'success'}
              sx={{ width: '100%' }}
            >
              {formError || formSuccess}
            </Alert>
          </Snackbar>
          <div className="table-responsive">
            <UserTableToolbar
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset', position: 'relative' }}>
                {loading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      zIndex: 1
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <Table sx={{ minWidth: 800 }}>
                  <TableMainHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleSort}
                    headLabel={[
                      { id: 'empty1', label: '' },
                      { id: 'Username', label: 'Email' },
                      { id: 'given_name', label: 'First Name' },
                      { id: 'family_name', label: 'Last Name' },
                      { id: 'email_verified', label: 'Verified' },
                      { id: 'empty2', label: '' }
                    ]}
                  />
                  <TableBody>
  {dataFiltered
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((row) => {
      const verified = row.Attributes.find((attr) => attr.Name === 'email_verified')?.Value;
      const isCurrentUser = currentUserEmail === row.Attributes.find((attr) => attr.Name === 'email')?.Value;
      return (
        <UserTableRow
          key={row.Username}
          email={row.Attributes.find((attr) => attr.Name === 'email')?.Value || 'N/A'}
          firstName={row.Attributes.find((attr) => attr.Name === 'given_name')?.Value || 'N/A'}
          lastName={row.Attributes.find((attr) => attr.Name === 'family_name')?.Value || 'N/A'}
          verified={verified === 'true' ? 'Verified' : 'Not Verified'}
          onClickEdit={isCurrentUser ? undefined : () => handleEditClick(row)}
          onClickDelete={isCurrentUser ? undefined : () => handleDeleteClick(row.Attributes.find((attr) => attr.Name === 'email')?.Value || '')}
          actionLoading={actionLoading} // Pass actionLoading to UserTableRow
        />
      );
    })}
  <TableEmptyRows
    height={77}
    emptyRows={emptyRows(page, rowsPerPage, users.length)}
  />
  {notFound && <TableNoData query={filterName} />}
</TableBody>

                </Table>
              </TableContainer>
            </Scrollbar>
            <TablePagination
              page={page}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default UserManagement;
