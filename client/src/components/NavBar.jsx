import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  const location = useLocation();
  const { pathname } = location;

  const navConfig = {
    '/': { to: '/login', text: 'Login' },
    '/secretary': { to: '/login', text: 'Cerrar Sesion' },
    '/teacher': { to: '/login', text: 'Cerrar Sesion' },
  };

  const currentNav = navConfig[pathname];
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2C965A' }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" style={{ fontFamily: 'Jaro', fontSize: '30px', color: 'white', fontWeight: 'bold' }}>Chasky</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav mx-auto text-center">
            {pathname === '/secretary' && (
              <>
                <Link
                  to="/secretary/messages"
                  className="btn mx-2 my-1"
                  style={{ color: 'white', fontSize: '16px', borderRadius: '10px', backgroundColor: '#1A6487', minWidth: '260px' }}
                >
                  Lista de mensajes
                </Link>
                <Link
                  to="/secretary/notice"
                  className="btn mx-2 my-1"
                  style={{ color: 'white', fontSize: '16px', borderRadius: '10px', backgroundColor: '#1A6487', minWidth: '260px' }}
                >
                  Crear Aviso
                </Link>
                <Link
                  to="/secretary/mails"
                  className="btn mx-2 my-1"
                  style={{ color: 'white', fontSize: '16px', borderRadius: '10px', backgroundColor: '#1A6487', minWidth: '260px' }}
                >
                  Enviar Correos
                </Link>
            </>
            )}
          </div>
          {currentNav && (
            <div className="navbar-nav ms-auto">
              <Link className='nav-link btn my-1' to={currentNav.to} style={{ color: 'white', fontSize: '16px', borderRadius: '10px', backgroundColor: '#1A6487' }}>
                {currentNav.text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;