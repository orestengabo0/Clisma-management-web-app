import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';
import { FaCarSide } from "react-icons/fa6";

// Sample data for the vehicle picker
const SAMPLE_VEHICLES = [
  { value: "veh-1", label: "Car" },
  { value: "veh-2", label: "Truck" },
  { value: "veh-3", label: "Bus" },
  { value: "veh-4", label: "MotoCycle" },
];

interface VehiclePickerProps {
  /** The currently selected vehicle ID (e.g., "veh-1") */
  value?: string;
  /** Callback when a new vehicle is selected */
  onChange: (value: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
}

const VehiclePicker = ({ value, onChange, placeholder = "Select Vehicle" }: VehiclePickerProps) => {
    const [open, setOpen] = useState(false)
    const selectedVehicle = SAMPLE_VEHICLES.find((veh) => veh.value === value);
  return (
    <Popover>
        <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            <FaCarSide className="h-4 w-4 shrink-0 opacity-50" />
            {selectedVehicle ? selectedVehicle.label : placeholder}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          {/* Search Input */}
          <CommandInput placeholder="Search location..." />
          
          <CommandList>
            <CommandEmpty>No vehicle found.</CommandEmpty>
            <CommandGroup>
              {SAMPLE_VEHICLES.map((vehicle) => (
                <CommandItem
                  key={vehicle.value}
                  value={vehicle.value}
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
                      value === vehicle.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {vehicle.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default VehiclePicker