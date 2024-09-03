import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button: React.FC<Props> = ({
  children,
  className,
  ...attributes
}) => (
  <button
    {...attributes}
    className={`${className} border-[2px] p-2 w-16 m-2 rounded-md border-black bg-green-500`}
  >
    {children}
  </button>
);
