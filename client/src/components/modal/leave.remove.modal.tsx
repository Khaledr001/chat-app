import { useEffect, useRef } from "react";

const LeaveOrRemoveModal = ({
  leave = true,
  isDelete = false,
  handler,
}: {
  leave?: boolean;
  isDelete?: boolean;
  handler: any;
}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  if (modalRef?.current) modalRef?.current.showModal();

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box !p-5">
        {isDelete ? (
          <h3 className="font-bold text-lg !mb-10">
            Do you want to delete this group?
          </h3>
        ) : (
          <h3 className="font-bold text-lg !mb-10">
            Do you want to{" "}
            {leave ? "leave this group" : "remove this user from this group"}
          </h3>
        )}

        <div className="modal-action gap-5">
          <button
            onClick={handler}
            className="btn !px-4 btn-outline btn-accent">
            YES
          </button>
          <form method="dialog">
            <button className="btn !px-4 btn-outline btn-success">NO</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default LeaveOrRemoveModal;
