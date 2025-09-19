import { Check, ChevronsUpDown, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

// Sample data for the location picker
const SAMPLE_LOCATIONS = [
  { value: "loc-1", label: "Kigali, Station A" },
  { value: "loc-2", label: "Kigali, Station B" },
  { value: "loc-3", label: "Musanze, North Hub" },
  { value: "loc-4", label: "Huye, South Corridor" },
  { value: "loc-5", label: "Rusizi, West Gate" },
];

interface LocationPickerProps {
  /** The currently selected location ID (e.g., "loc-1") */
  value?: string;
  /** Callback when a new location is selected */
  onChange: (value: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
}

export function LocationPicker({
  value,
  onChange,
  placeholder = "Select location",
}: LocationPickerProps) {
  const [open, setOpen] = useState(false);

  // Find the label for the currently selected value
  const selectedLocation = SAMPLE_LOCATIONS.find((loc) => loc.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 opacity-50" />
            {selectedLocation ? selectedLocation.label : placeholder}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          {/* Search Input */}
          <CommandInput placeholder="Search location..." />
          
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {SAMPLE_LOCATIONS.map((location) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                  onSelect={(currentValue) => {
                    // If the user clicks the same value, do nothing. Otherwise, update.
                    if (currentValue !== value) {
                      onChange(currentValue);
                    }
                    setOpen(false);
                  }}
                >
                  {/* Checkmark for the selected item */}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === location.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}