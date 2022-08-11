import { ReactNode } from "react";

type BoxProps = {
  children: ReactNode;
};

export function Box({ children }: BoxProps) {
  return (
    <div className="box">
      <div className="box__content">{children}</div>
    </div>
  );
}