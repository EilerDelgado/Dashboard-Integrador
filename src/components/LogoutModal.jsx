import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function LogoutModal({ show, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onClose();
        // Aquí puedes hacer limpieza (token, estado, etc.)
        navigate("/login");
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>¿Listo para salir?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Selecciona "Cerrar Sesión" si estás listo para finalizar tu sesión actual.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleLogout}>
                    Cerrar Sesión
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
