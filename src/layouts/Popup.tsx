import { FC, ComponentProps } from "react";
import create from "zustand";
import { MdClose } from "react-icons/md";

interface PopUpState {
  value: string;
  visible: boolean;
  close: () => void;
  open: () => void;
  setValue: (value: string) => void;
}

export const usePopUp = create<PopUpState>()((set) => ({
  value: "loading...",
  visible: true,
  close: () => set((state) => ({ ...state, visible: false })),
  open: () => set((state) => ({ ...state, visible: true })),
  setValue: (value) => set((state) => ({ ...state, value })),
}));

interface IPopupsProps extends ComponentProps<"div"> {}

const Popup: FC<IPopupsProps> = ({ children }) => {
  // const value = usePopUp((state) => state.value);
  const { value, visible, close } = usePopUp((state) => ({
    value: state.value,
    visible: state.visible,
    close: state.close,
  }));

  return (
    <div>
      {children}
      {visible ? (
        <div className="fixed bottom-10 right-10 flex min-w-[200px] justify-between space-x-2 rounded-md bg-slate-700 p-2 font-Montserrat text-white">
          <p className="font-Montserrat capitalize">{value}</p>
          <button
            onClick={close}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-500 text-white "
          >
            <MdClose />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Popup;
