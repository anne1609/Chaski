import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!formData.password.trim()) {
      setError('La contraseña es requerida');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Ingrese un email válido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Navigate based on user role
        if (result.user.role === 'secretary') {
          navigate('/secretary');
        } else if (result.user.role === 'teacher') {
          navigate('/teacher');
        }
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error inesperado. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #2C965A 0%, #1A6487 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="card-header bg-primary text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #2C965A 0%, #1A6487 100%)' }}>
                <h3 className="mb-0 fw-bold">
                  Chaski - Iniciar Sesión
                </h3>
                <p className="mb-0 mt-2 opacity-75">Sistema de Comunicación Escolar</p>
              </div>
              
              <div className="card-body p-4" style={{ background: '#f8f9fa' }}>
                <form onSubmit={handleSubmit} noValidate>
                  {error && (
                    <div className="alert alert-danger border-0 shadow-sm" role="alert" style={{ borderRadius: '10px' }}>
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold text-dark">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-lg border-0 shadow-sm ${error && !formData.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ingrese su email"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                      style={{ 
                        borderRadius: '10px',
                        background: 'white',
                        border: '2px solid #e9ecef !important',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2C965A'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold text-dark">
                      Contraseña <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control form-control-lg border-0 shadow-sm ${error && !formData.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Ingrese su contraseña"
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                      style={{ 
                        borderRadius: '10px',
                        background: 'white',
                        border: '2px solid #e9ecef !important',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2C965A'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>
                  
                  <div className="d-grid mb-3">
                    <button 
                      type="submit" 
                      className="btn btn-lg fw-semibold shadow"
                      disabled={isLoading || !formData.email || !formData.password}
                      style={{
                        background: 'linear-gradient(135deg, #2C965A 0%, #1A6487 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        padding: '12px',
                        transition: 'all 0.3s ease',
                        transform: isLoading ? 'scale(0.98)' : 'scale(1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.target.style.transform = 'scale(1.02)';
                          e.target.style.boxShadow = '0 8px 25px rgba(44, 150, 90, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Ingresando...
                        </>
                      ) : (
                        <>
                          Ingresar
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                {/* Demo credentials info */}
                <div className="mt-4 p-3 rounded-3" style={{ background: 'white', border: '1px solid #dee2e6' }}>
                  <div className="text-center mb-2">
                    <strong style={{ color: '#2C965A' }}>Credenciales de Prueba</strong>
                  </div>
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="p-2 rounded" style={{ background: 'rgba(44, 150, 90, 0.1)' }}>
                        <small className="d-block fw-bold" style={{ color: '#2C965A' }}>👩‍💼 Secretaria</small>
                        <small className="text-muted d-block">secretaria@gmail.com</small>
                        <small className="text-muted">secretaria123</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 rounded" style={{ background: 'rgba(26, 100, 135, 0.1)' }}>
                        <small className="d-block fw-bold" style={{ color: '#1A6487' }}>👨‍🏫 Profesor</small>
                        <small className="text-muted d-block">profesor@mail.com</small>
                        <small className="text-muted">profesor123</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
