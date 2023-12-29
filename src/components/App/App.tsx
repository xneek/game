import React from 'react';
import logo from './logo.svg';
import './App.css';
import Footer from '../Footer';
import PlayingField from '../PlayingField';

function App() {
  return (
    <div className="app">
      <PlayingField />
      <Footer />
    </div>
  );
}

export default App;
