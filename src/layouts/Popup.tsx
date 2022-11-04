import { FC, ComponentProps, useEffect, useMemo } from "react";
import create from "zustand";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

type StatusType = "default" | "error";

interface PopUpState {
  value: string;
  visible: boolean;
  status: StatusType;
  close: () => void;
  open: () => void;
  setValue: (value: string, status?: StatusType) => void;
}

export const usePopUp = create<PopUpState>()((set) => ({
  value: "loading...",
  visible: false,
  status: "default",
  close: () => set((state) => ({ ...state, visible: false })),
  open: () => set((state) => ({ ...state, visible: true })),
  setValue: (value, status = "default") =>
    set((state) => ({
      ...state,
      value: Math.random().toString() + ":" + value,
      status,
      visible: true,
    })),
}));

interface IPopupsProps extends ComponentProps<"div"> {}

const Popup: FC<IPopupsProps> = ({ children }) => {
  // const value = usePopUp((state) => state.value);
  const { value, visible, close, status } = usePopUp((state) => ({
    value: state.value,
    status: state.status,
    visible: state.visible,
    close: state.close,
  }));

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;

    if (visible) {
      console.log("readig timeout");
      timeout = setTimeout(() => close(), 5000);
    }
    return () => clearTimeout(timeout);
  }, [value, visible]);

  const handleStatus = (status: StatusType) => {
    switch (status) {
      case "error":
        return "bg-red-600";
      default:
        return "bg-slate-700 ";
    }
  };

  const noHashValue = useMemo(() => value.split(":")[1], [value]);

  return (
    <div>
      {children}
      <AnimatePresence>
        {visible ? (
          <motion.div
            initial={{ translateY: 10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 10, opacity: 0 }}
            className={`fixed bottom-10 right-10 flex min-w-[200px] justify-between space-x-2 rounded-md p-2 font-Montserrat text-white ${handleStatus(
              status
            )}`}
          >
            <p className=" font-Montserrat capitalize">{noHashValue}</p>
            <button
              onClick={close}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-500 text-white "
            >
              <MdClose />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Popup;
