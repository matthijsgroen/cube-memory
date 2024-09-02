import { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";

export type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button: React.FC<Props> = ({ children, ...attributes }) => (
  <button {...attributes}>{children}</button>
);
