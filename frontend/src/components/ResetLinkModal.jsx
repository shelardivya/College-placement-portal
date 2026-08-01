
import './ResetLinkModal.css';
import { MailOpen, Check, ArrowRight } from "lucide-react";

function ResetLinkModal({ isOpen, onClose, onSimulateClick }) {
    //If the modal is not open , render absolutely nothing
    if (!isOpen) return null;

    return (
        <button type="button" className="modal-overlay" aria-label="Close reset link modal backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ border: 'none', padding: 0, textAlign: 'left' }}>
            <div className="modal-container">

                {/*Visual Header Graphic*/}
                <div className="modal-icon-wrapper">
                    <MailOpen size={32} />
                    <div className="check-badge">
                        < Check size={12} />
                    </div>
                </div>

                {/*Text Messages*/}
                <div className="modal-header">
                    <h2>Reset Link Sent!</h2>
                    <p>We've sent a simulated password recovery link to:</p>
                    <strong className="target-email"></strong>
                </div>

                <p className="modal-description">
                    In a production app, the user would check their email client. Click on the simulator link button below to bypass this and open the Reset Password from directly inside the app.
                </p>

                {/*Simulated action triggers*/}
                <div className="modal-actions">
                    <button type="button" className="btn-cancel-modal" onClick={onClose}>
                        Close
                    </button>

                    <button type="button" className="btn-simulate-modal" onClick={onSimulateClick}>
                        Simulate Link CLick
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </button>
    );
}

export default ResetLinkModal;