// client/src/pages/Register.jsx
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Register</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} className={styles.select}>
          <option value="user">User</option>
          <option value="host">Host</option>
        </select>
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
      <p className={styles.text}>
        Already have an account? <Link to="/login" className={styles.link}>Login</Link>
      </p>
    </div>
  );
};

export default Register;