import Button from "./Button";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-950">{title}</h2>
          <Button variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
