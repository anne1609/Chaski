import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const users = {
  Secretary: { email: 'secretaria@gmail.com', password: 'secretaria', role: 'secretaria' },
  Teacher: { email: 'profesor@gmail.com', password: 'profesor', role: 'profesor' },
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); 

    const user = Object.values(users).find(u => u.email === email);

    if (user && user.password === password) {
      if (user.role === 'secretary') {
        navigate('/secretary');
      } else if (user.role === 'teacher') {
        navigate('/teacher');
      }
    } else {
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger" role="alert">{error}</div>} 
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email</label> 
                  <input
                    type="email" 
                    className="form-control"
                    id="emailInput" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
        
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Ingresar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
