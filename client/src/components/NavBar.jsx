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
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav me-auto"> 
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              <a className="nav-link" href="#">Features</a>
              <a className="nav-link" href="#">Pricing</a>
              <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>
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
