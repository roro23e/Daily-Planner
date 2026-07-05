import Modal from "../ui/Modal.jsx";
import Btn from "../ui/Btn.jsx";

export default function DeleteConfirm({ onConfirm, onClose }) {
  return (
    <Modal
      title="Delete task"
      sub="This action cannot be undone."
      onClose={onClose}
      footer={<>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" icon="ti-trash" onClick={() => { onConfirm(); onClose(); }}>Delete task</Btn>
      </>}
    >
      <p style={{fontSize:14,color:"#64748B",lineHeight:1.6}}>
        Are you sure you want to delete this task? All comments and attachments will be permanently removed.
      </p>
    </Modal>
  );
}
