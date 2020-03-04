import React from 'react';
import './Modal.css';

const Modal = props => {
    const { title, canCancel, canConfirm, confirmText } = props;
    return (
        <div className="modal">
            <header className="modal__header"><h1>{title}</h1></header>
            <section className="modal__content">
                {props.children}
            </section>
            <section className="modal__actions">
                {canCancel && <button className="btn" onClick={props.onCancel}>
                    Cancel
                </button>}
                {canConfirm && <button className="btn" onClick={props.onConfirm}>
                    {confirmText}
                </button>}
            </section>
        </div>
    )
}

export default Modal;