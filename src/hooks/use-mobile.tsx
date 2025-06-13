
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Debounce function to prevent rapid state changes
    let timeoutId: NodeJS.Timeout
    
    const onChange = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT
        console.log(`Mobile detection changed: ${newIsMobile}`)
        setIsMobile(newIsMobile)
      }, 100) // 100ms debounce
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    return () => {
      mql.removeEventListener("change", onChange)
      clearTimeout(timeoutId)
    }
  }, [])

  return !!isMobile
}
