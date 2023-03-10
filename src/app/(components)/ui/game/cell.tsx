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
      className={`h-[27vw] w-[27vw] md:h-[21vw] md:w-[19vw] lg:h-[14vw] lg:w-[14vw] border-slate-900 border-2 flex flex-col align-middle
      ${!disabled? 
        "hover:bg-slate-200 hover:z-20 hover:shadow-lg hover:rounded-xl"
        : ""}`}>
      {children}
      <div className="mt-auto flex flex-row">
        <p className="ml-auto text-4xl font-bold m-2">{value}</p>
      </div>
    </button>
  )
}