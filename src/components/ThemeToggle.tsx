
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-5 w-5 transition-colors ${!isDark ? 'text-amber-500' : 'text-muted-foreground'}`} />
      <Switch
        id="theme-switch"
        checked={isDark}
        onCheckedChange={toggleTheme}
      />
      <Moon className={`h-5 w-5 transition-colors ${isDark ? 'text-blue-400' : 'text-muted-foreground'}`} />
    </div>
  )
}
