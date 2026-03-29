import './App.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/apis/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      await fetch('/apis/seed', { method: 'POST' });
      fetchUsers();
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-6 drop-shadow-sm">
        Docker + Mongo Database Connection
      </h1>
      
      <div className="flex gap-4 mb-8">
        <Button variant="contained" color="primary" onClick={fetchUsers}>
          Refresh Data
        </Button>
        <Button variant="outlined" color="secondary" onClick={seedDatabase}>
          Seed Database
        </Button>
      </div>

      <div className="w-full max-w-2xl grid gap-4 grid-cols-1 md:grid-cols-2">
        {loading ? (
          <Typography className="col-span-1 md:col-span-2 text-center text-gray-500">
            Loading...
          </Typography>
        ) : users.length === 0 ? (
          <Typography className="col-span-1 md:col-span-2 text-center text-gray-500">
            No users found. Click "Seed Database" to add dummy data!
          </Typography>
        ) : (
          users.map((user) => (
            <Card key={user._id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col h-full justify-center">
                <Typography variant="h6" className="text-gray-800 font-semibold mb-1">
                  {user.name}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {user.email}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
