import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemList from './components/ItemList';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items from the backend
    axios.get('http://localhost:5000/api/items')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <div className="App">
      <h1>React + Node + MongoDB Boilerplate</h1>
      <ItemList items={items} />
    </div>
  );
}

export default App;
