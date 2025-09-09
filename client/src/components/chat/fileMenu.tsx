import { File, FileMusic, FileVideoIcon, Image, Paperclip } from "lucide-react";
import { useRef, type RefObject } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUploadLoader } from "../../redux/reducers/mics.reducer";
import { useSendAttachmentsMutation } from "../../redux/api/api.rtk";
import { useParams } from "react-router-dom";

const FileMenu = () => {
  const { id } = useParams();
  const chatId = id;

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const vedioRef = useRef(null);
  const fileRef = useRef(null);

  const selectRef = (ref: RefObject<any>) => {
    ref.current?.click();
  };

  const dispatch = useDispatch();

  const [sendAttachments] = useSendAttachmentsMutation();

  const onFileChageHandler = async ({
    e,
    key,
  }: {
    e: React.ChangeEvent<HTMLInputElement>;
    key: "Files" | "Videos" | "Audios" | "Images";
  }) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length < 1) return;
    if (files.length > 5)
      return toast.error(`You can send at most 5${key} at a time!`);

    dispatch(setUploadLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);

    try {
      const myForm = new FormData();
      if (!chatId) return;
      myForm.append("chat", chatId);
      files.forEach((file) => myForm.append("attachment", file));

      const res = await sendAttachments(myForm);

      if (res?.data) toast.success(`${key} send succesfully!`, { id: toastId });
      else toast.error(`Filed to send ${key}`, { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };
  return (
    <div>
      <div className="dropdown dropdown-top">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle btn-sm">
          <Paperclip className="h-5 w-5" />
        </div>

        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm">
          <li onClick={() => selectRef(fileRef)}>
            <a>
              <div className="flex gap-2 items-center !m-2">
                <File />
                <p className="font-semibold text-lg">File</p>
              </div>
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                accept="*"
                ref={fileRef}
                onChange={(e) => onFileChageHandler({ e, key: "Files" })}
              />
            </a>
          </li>
          <li onClick={() => selectRef(vedioRef)}>
            <a>
              <div className="flex gap-2 items-center !m-2">
                <FileVideoIcon />
                <p className="font-semibold text-lg">Video</p>
              </div>
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                accept="video/mp4, video/webm, video/ogg, video/mkv"
                ref={vedioRef}
                onChange={(e) => onFileChageHandler({ e, key: "Videos" })}
              />
            </a>
          </li>
          <li onClick={() => selectRef(audioRef)}>
            <a>
              <div className="flex gap-2 items-center !m-2">
                <FileMusic />
                <p className="font-semibold text-lg">Audio</p>
              </div>
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                accept="audio/mpeg, audio/wav, audio/ogg"
                ref={audioRef}
                onChange={(e) => onFileChageHandler({ e, key: "Audios" })}
              />
            </a>
          </li>
          <li onClick={() => selectRef(imageRef)}>
            <a>
              <div className="flex gap-2 items-center !m-2">
                <Image />
                <p className="font-semibold text-lg">Image</p>
              </div>
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                accept="image/png, image/jpg, image/webp, image/jpeg"
                ref={imageRef}
                onChange={(e) => onFileChageHandler({ e, key: "Images" })}
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FileMenu;
