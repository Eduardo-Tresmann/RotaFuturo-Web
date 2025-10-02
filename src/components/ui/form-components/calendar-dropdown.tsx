import * as React from "react";
import { Select, SelectOption } from "../select";
interface CalendarDropdownProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  ariaLabel?: string;
}
export const CalendarDropdown: React.FC<CalendarDropdownProps> = ({ options, value, onChange, ariaLabel }) => {
  return (
    <div className="min-w-[90px] max-w-[160px]">
      <Select options={options} value={value} onChange={onChange} ariaLabel={ariaLabel} />
    </div>
  );
};
