
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard() {
  const [writers, setWriters] = useState([]);

  useEffect(() => {
    api.get('writers/')
      .then(response => {
        setWriters(response.data);
      })
      .catch(error => {
        console.error(error);
        alert('Error fetching data.');
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Writer</th>
            <th>Total Articles Written</th>
            <th>Total Articles Written Last 30 Days</th>
          </tr>
        </thead>
        <tbody>
          {writers.map(writer => (
            <tr key={writer.id}>
              <td>{writer.name}</td>
              <td>{writer.total_articles}</td>
              <td>{writer.articles_last_30}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
