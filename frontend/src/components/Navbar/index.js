import logo from '../../img/logo.png';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function Navbar() {
    return (
        <>
    <div className="logo-img">
        <img src={logo} alt="Vite logo" />
    </div>

    <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="home" title="Home">
        Apartaments
      </Tab>
      <Tab eventKey="profile" title="Profile">
        About us
      </Tab>
      <Tab eventKey="contact" title="Contact">
        Contact
      </Tab>
    </Tabs>
    </>
    );
}