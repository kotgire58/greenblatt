import React from 'react';

function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item._id}>{item.name},{item.date}</li>
      ))}
    </ul>
  );
}

export default ItemList;
