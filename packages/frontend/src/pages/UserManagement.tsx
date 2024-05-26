import React, { useEffect, useState } from 'react';

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
      </div>
    </div>
  );
};

export default UserManagement;
