import { useEffect, useRef, FC, MutableRefObject } from "react";

interface IUseClickAwayProps {
  onClickAway: () => void;
}

// function useClickAway<T>(onClickAway) {

// }

const useClickAway = <T = HTMLDivElement,>({
  onClickAway,
}: IUseClickAwayProps) => {
  const ref = useRef<T | null>(null) as MutableRefObject<HTMLDivElement | null>;
  const handler = (e: MouseEvent) => {
    const el = e.target;
    if (el instanceof Node && !ref?.current?.contains(el)) return onClickAway();
  };

  useEffect(() => {
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  return ref;
};

export default useClickAway;
