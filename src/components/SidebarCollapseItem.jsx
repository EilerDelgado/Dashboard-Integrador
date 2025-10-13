import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function SidebarCollapseItem({ icon, title, items }) {
    const [open, setOpen] = useState(false);

    return (
        <li className="nav-item">
            <div
                className="nav-link collapsed d-flex align-items-center"
                onClick={() => setOpen(!open)}
                style={{ cursor: 'pointer' }}
            >
                <i className={`fas fa-fw ${icon}`} />
                <span className="ms-2">{title}</span>
            </div>
            <Collapse in={open}>
                <div>
                    <div className="bg-white py-2 collapse-inner rounded ps-3">
                        <h6 className="collapse-header">Acciones:</h6>
                        {items.map((item, index) => (
                            <Link key={index} className="collapse-item nav-link" to={item.to}>
                                {item.text}
                            </Link>
                        ))}
                    </div>
                </div>
            </Collapse>
        </li>
    );
}
