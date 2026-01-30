import React, { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface SearchableSelectProps {
  value: string;
  placeholder: string;
  items: any[];
  labelKey: string;
  valueKey: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SearchableSelect = ({
  value,
  placeholder,
  items,
  labelKey,
  valueKey,
  onChange,
  disabled,
}: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedLabel = items.find(
    (item) => String(item[valueKey]) === String(value),
  )?.[labelKey];

  return (
    <Select open={open} onOpenChange={setOpen} disabled={disabled}>
      <SelectTrigger className="w-full">
        <div className="text-sm text-foreground">
          {selectedLabel || placeholder}
        </div>
      </SelectTrigger>

      <SelectContent className="p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={search}
            onValueChange={setSearch}
          />

          <CommandEmpty>No result found.</CommandEmpty>

          <CommandGroup className="max-h-60 overflow-y-auto">
            {items
              .filter((item) =>
                item[labelKey]
                  ?.toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map((item) => (
                <CommandItem
                  key={item[valueKey]}
                  onSelect={() => {
                    onChange(String(item[valueKey]));
                    setSearch("");
                    setOpen(false);
                  }}
                >
                  {item[labelKey]}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </SelectContent>
    </Select>
  );
};



export default SearchableSelect