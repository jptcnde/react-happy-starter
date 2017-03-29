import React, { Component } from 'react';
import styles from './App.css';
import logo from './logo.svg';
export default class App extends Component {
  render() {
    return (
			<div>
				<img src={logo} className={styles['app-logo']} alt="logo" />
				<h1>Hello, world!</h1>
			</div>
    );
  }
}
