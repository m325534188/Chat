
import React, { useState, useEffect } from 'react';

const DeleteUser = () => {
  const [users, setUsers] = useState([]);    
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/users');  
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Response is not an array');
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      const res = await fetch('http://localhost:5000/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),        
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Delete failed');
      alert(data.message);
      setUsers((u) => u.filter((user) => user._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>טוען משתמשים...</p>;
  if (error)   return <p style={{ color:'red' }}>שגיאה: {error}</p>;

  
  return (
    <div>
      <h2>רשימת משתמשים</h2>
      {users.length === 0
        ? <p>אין משתמשים להצגה</p>
        : users.map((user) => (
            <div key={user._id} style={{ marginBottom: '8px' }}>
              <span>{user.username}</span>{' '}
              <button onClick={() => handleDelete(user._id)}>
                מחק
              </button>
            </div>
          ))
      }
    </div>
  );
};

export default DeleteUser;
