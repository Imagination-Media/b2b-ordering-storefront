import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  error,
  disabled,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  return (
    <div className={`space-y-1 ${className || ""}`}>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className={`w-full flex items-center justify-between px-3 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
          } ${disabled ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="flex items-center border-b px-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500"
                type="text"
              />
            </div>
            <ul className="max-h-[300px] overflow-y-auto p-1">
              {options
                .filter((opt) =>
                  opt.label.toLowerCase().includes(search.toLowerCase()),
                )
                .map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 ${
                      value === opt.value ? "bg-gray-100" : ""
                    }`}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === opt.value ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {opt.label}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
