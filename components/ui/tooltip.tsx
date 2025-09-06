"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode
}

interface TooltipTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

interface TooltipContentProps {
  side?: "top" | "right" | "bottom" | "left"
  className?: string
  children: React.ReactNode
}

const TooltipContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

const TooltipProvider = ({ children }: TooltipProps) => {
  return <>{children}</>
}

const Tooltip = ({ children }: TooltipProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  TooltipTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ asChild, children, ...props }, ref) => {
  const { setIsOpen } = React.useContext(TooltipContext)
  
  if (asChild) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onMouseEnter: () => setIsOpen(true),
      onMouseLeave: () => setIsOpen(false),
      ref,
    })
  }
  
  return (
    <button
      ref={ref}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(({ side = "bottom", className, children }, ref) => {
  const { isOpen } = React.useContext(TooltipContext)
  
  if (!isOpen) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        side === "bottom" && "top-full mt-1",
        side === "top" && "bottom-full mb-1",
        side === "right" && "left-full ml-1",
        side === "left" && "right-full mr-1",
        className
      )}
    >
      {children}
    </div>
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
