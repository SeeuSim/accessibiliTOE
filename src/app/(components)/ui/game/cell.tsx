import { ButtonHTMLAttributes, MouseEventHandler } from "react";

export default function Cell({ 
  value, 
  onClick,
  disabled,
  children
} : { 
  value: number, 
  onClick: MouseEventHandler<HTMLButtonElement> , 
  disabled: ButtonHTMLAttributes<HTMLButtonElement>["disabled"],
  children: React.ReactNode 
}) {
  return (
    <button
      onClick={onClick} 
      disabled={disabled}
      className={`h-[27vw] w-[27vw] md:h-[21vw] md:w-[19vw] lg:h-[14vw] lg:w-[14vw] border-slate-900 border-2 
      ${!disabled? 
        "hover:bg-slate-200 hover:z-20 hover:shadow-lg hover:rounded-lg"
        : ""}`}>
      {value}
      {children}
    </button>
  )
}