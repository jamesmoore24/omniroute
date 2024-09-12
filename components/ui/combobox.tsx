"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { Badge } from "@/components/ui/badge"; // Add this import

interface Provider {
  name: string;
  avatar: string;
  costPerToken: number;
}

interface ComboboxProps {
  providers: Provider[];
  onSelectedValuesChange: (values: string[]) => void;
  initialSelectedValues?: string[];
}

export function Combobox({
  providers,
  onSelectedValuesChange,
  initialSelectedValues = [],
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    initialSelectedValues
  );

  const handleSelect = (providerName: string) => {
    const newSelectedValues = selectedValues.includes(providerName)
      ? selectedValues.filter((name) => name !== providerName)
      : [...selectedValues, providerName];

    setSelectedValues(newSelectedValues);
    onSelectedValuesChange(newSelectedValues);
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : "Select LLM providers..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search providers..." />
            <CommandList>
              <CommandEmpty>No provider found.</CommandEmpty>
              <CommandGroup>
                {providers.map((provider) => (
                  <CommandItem
                    key={provider.name}
                    value={provider.name}
                    onSelect={() => handleSelect(provider.name)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(provider.name)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {provider.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2">
        {selectedValues.map((provider) => (
          <Badge
            key={provider}
            variant="secondary"
            className="text-xs text-black"
          >
            {provider}
          </Badge>
        ))}
      </div>
    </div>
  );
}
