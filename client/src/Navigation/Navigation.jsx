import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Menu, X, User } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  // Determine the correct BMI route by role
  const getBmiRoute = () => {
    if (!user) return "#";
    switch (user.role) {
      case "customer":
        return "/bmi";
      case "trainer":
      case "admin":
        return "/bmitrainer";
      default:
        return "/bmitrainer";
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="shadow-lg py-3">
      <Container>
        {/* Left side: profile icon + brand */}
        <div className="d-flex align-items-center gap-4">
          {user && (
            <Nav.Link
              as={Link}
              to="/profile"
              className="text-white d-flex align-items-center gap-2"
            >
              <User size={20} />
              Profile
            </Nav.Link>
          )}
          <Navbar.Brand as={Link} to="/" className="fw-bold text-danger">
            FitZone
          </Navbar.Brand>
        </div>

        {/* Mobile toggle */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-3">
            {/* Customer-only */}
            {user?.role === "customer" && (
              <>
                <Nav.Link as={Link} to="/paymentform" className="text-white">
                  Make Payment
                </Nav.Link>
                <Nav.Link as={Link} to="/showworkout" className="text-white">
                  Workout Schedule
                </Nav.Link>
                <Nav.Link as={Link} to="/dietview" className="text-white">
                  View Diet Plan
                </Nav.Link>
              </>
            )}

            {/* Trainer-only */}
            {user?.role === "trainer" && (
              <>
                <Nav.Link as={Link} to="/addworkout" className="text-white">
                  Add Workout
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/showtrainerworkout"
                  className="text-white"
                >
                  Update Workout
                </Nav.Link>
                <Nav.Link as={Link} to="/adddiet" className="text-white">
                  Add Customer Diet
                </Nav.Link>
              </>
            )}

            {/* BMI link */}
            {user && (
              <Nav.Link as={Link} to={getBmiRoute()} className="text-white">
                BMI
              </Nav.Link>
            )}

            {/* Payment History */}
            {user?.role === "customer" && (
              <Nav.Link as={Link} to="/paymenthistory" className="text-white">
                Payment History
              </Nav.Link>
            )}
            {user?.role === "trainer" && (
              <Nav.Link as={Link} to="/trainerhistory" className="text-white">
                Payment History
              </Nav.Link>
            )}

            {/* Admin-only */}
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/adminquery" className="text-white">
                My Dashboard
              </Nav.Link>
            )}

            {/* Auth Buttons */}
            {!user ? (
              <>
                <Button
                  as={Link}
                  to="/register"
                  variant="warning"
                  className="text-white px-4 py-2"
                >
                  Register
                </Button>
                <Button
                  as={Link}
                  to="/login"
                  variant="success"
                  className="px-4 py-2"
                >
                  Login
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                className="px-4 py-2"
                onClick={logout}
              >
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
