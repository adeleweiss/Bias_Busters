import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar(){

    return <Navbar bg="success" expand="sm" collapseOnSelect>
    <Container className="navigation_bar">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Brand as={Link} to="/">
            Home
        </Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav" className="me-auto">
            <Nav>
                <Nav.Link as={Link} to="/TextBias">Am I Biased</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Container>
</Navbar>
}