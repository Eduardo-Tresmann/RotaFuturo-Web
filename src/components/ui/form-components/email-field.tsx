import { TextField } from './text-field'
import { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

interface EmailFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string
  label?: string
  required?: boolean
  icon?: LucideIcon
  iconColor?: string
}

export const EmailField = forwardRef<HTMLInputElement, EmailFieldProps>(
  ({ error, label, required, icon, iconColor, ...rest }, ref) => {
    return (
      <TextField
        ref={ref}
        type="email"
        label={label}
        required={required}
        error={error}
        icon={icon}
        iconColor={iconColor}
        {...rest}
      />
    )
  }
)

EmailField.displayName = 'EmailField'
