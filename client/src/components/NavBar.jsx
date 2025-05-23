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
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-green" style={{ backgroundColor: '#2C965A' }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Chaski</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav mx-auto">
             
              <button className='btn mx-3' style={{ color: 'white', borderRadius: '10px', backgroundColor: '#1A6487' }} >Lista de mensajes</button>
              <button className='btn mx-3' style={{ color: 'white', borderRadius: '10px', backgroundColor: '#1A6487' }} >Crear Aviso</button>
              {pathname === '/secretary' && (
                <Link to="/secretary/mails" className='btn' style={{ color: 'white', borderRadius: '10px', backgroundColor: '#1A6487' }} >Enviar Correos</Link>

              )}
              <button className='btn mx-3' style={{ color: 'white', borderRadius: '10px', backgroundColor: '#1A6487' }} > <Link to="/secretary/mails"  style={{textDecoration:'none', color:'white'}} >Enviar Correos</Link></button>

            </div>

            {currentNav && (
              <div className="navbar-nav">
                <Link className='nav-link' to={currentNav.to}>
                  {currentNav.text}
                </Link>
              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  )
}

export default NavBar
