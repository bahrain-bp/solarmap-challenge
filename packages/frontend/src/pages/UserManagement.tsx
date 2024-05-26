import React, { useEffect, useState } from 'react';
import UserTableToolbar from '../usertable/table-toolbar';
import UserTableRow from '../usertable/table-row';
import TableNoData from '../usertable/table-no-data';
import TableMainHead from '../usertable/table-head';
import TableEmptyRows from '../usertable/table-empty-rows';
import { emptyRows, getComparator } from '../usertable/utils';
import { applyFilter } from '../usertable/filterUtil';
import Scrollbar from '../components/scrollbar';
import { Table, TableBody, TableContainer } from '@mui/material';

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
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

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
        setError('Failed to fetch users');
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
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

   // table vars
   const [page, setPage] = useState(0);

   const [order, setOrder] = useState('asc');
 
   const [orderBy, setOrderBy] = useState('name');
 
   const [filterName, setFilterName] = useState('');
 
   const [rowsPerPage, setRowsPerPage] = useState(10);
 
   // table functions
   const handleSort = (event, id) => {
     const isAsc = orderBy === id && order === 'asc';
     if (id !== '') {
       setOrder(isAsc ? 'desc' : 'asc');
       setOrderBy(id);
     }
   };
 
   const handleChangePage = (event, newPage) => {
     setPage(newPage);
   };
 
   const handleChangeRowsPerPage = (event) => {
     setPage(0);
     setRowsPerPage(parseInt(event.target.value, 10));
   };
 
   const handleFilterByName = (event) => {
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
    <div className="container">
      <h1>User Management</h1>
      <button className="btn btn-primary mb-3" onClick={() => { setShowForm(!showForm); setIsEditing(false); }}>
        {showForm ? 'Hide Form' : 'Add User'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-3">
          {formError && <div className="alert alert-danger">{formError}</div>}
          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly={isEditing} // Make email read-only when editing
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update User' : 'Create User'}
          </button>
        </form>
      )}
      <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Actions</th> {/* Add Actions column header */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.Username}>
                <td>{user.Username}</td>
                <td>{user.Attributes.find((attr) => attr.Name === 'email')?.Value || 'N/A'}</td>
                <td>{user.Attributes.find((attr) => attr.Name === 'given_name')?.Value || 'N/A'}</td>
                <td>{user.Attributes.find((attr) => attr.Name === 'family_name')?.Value || 'N/A'}</td>
                <td>
                  <button className="btn btn-warning btn-sm" onClick={() => handleEditClick(user)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm ml-2" onClick={() => handleDeleteClick(user.Attributes.find((attr) => attr.Name === 'email')?.Value || '')}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         <UserTableToolbar
              filterName={filterName}
              onFilterName={handleFilterByName}
            />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableMainHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={users.length}
                    onRequestSort={handleSort}
                    headLabel={[
                      { id: 'zift1', label: '' },
                      { id: 'catDesc', label: 'Name' },
                      { id: 'zift2', label: '' }
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <UserTableRow
                          key={row.Username}
                          email={row.Attributes.find((attr) => attr.Name === 'email')?.Value || 'N/A'}
                          firstName={row.Attributes.find((attr) => attr.Name === 'given_name')?.Value || 'N/A'}
                          lastName={row.Attributes.find((attr) => attr.Name === 'family_name')?.Value || 'N/A'}
                          onClickEdit={() => handleEditClick(row)}
                          onClickDelete={() => handleDeleteClick(row.Attributes.find((attr) => attr.Name === 'email')?.Value || '')}
                        />
                      ))}

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
              count={categories.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
      </div>
    </div>
  );
};

export default UserManagement;
