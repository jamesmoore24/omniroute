import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, DollarSign, Hash } from "lucide-react";
import { Combobox as ComboboxComponent } from "@/components/ui/combobox";
import { LLM_PROVIDERS } from "@/data/aiData";
import { formatNumber } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface SidebarContentProps {
  totalSaved: number;
  totalTokens: number;
  selectedProviders: string[];
  setSelectedProviders: React.Dispatch<React.SetStateAction<string[]>>;
  showMessageStats: boolean;
  setShowMessageStats: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarContent({
  totalSaved,
  totalTokens,
  selectedProviders,
  setSelectedProviders,
  showMessageStats,
  setShowMessageStats,
}: SidebarContentProps): JSX.Element {
  const [costPreference, setCostPreference] = useState(50);
  const [qualityPreference, setQualityPreference] = useState(50);
  const [latencyPreference, setLatencyPreference] = useState(50);
  const [isAdjustingCost, setIsAdjustingCost] = useState(false);
  const [isAdjustingQuality, setIsAdjustingQuality] = useState(false);
  const [isAdjustingLatency, setIsAdjustingLatency] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const handleSliderPointerMove = (
    event: React.PointerEvent<HTMLSpanElement>
  ) => {
    setPopoverPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start mb-4 text-black"
          >
            <Plus className="mr-2 h-4 w-4" /> New Room
          </Button>
          {[
            "how to download goo...",
            "how to look at error lo...",
            "what does cohere do ...",
          ].map((room, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start mb-2 text-left text-black"
            >
              {room}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="mt-2 pb-4">
          <ComboboxComponent
            providers={LLM_PROVIDERS}
            onSelectedValuesChange={(values) => setSelectedProviders(values)}
            initialSelectedValues={selectedProviders}
          />
        </div>
        <div className="flex items-center mb-4">
          <Checkbox
            id="showStats"
            checked={showMessageStats}
            onCheckedChange={(checked) =>
              setShowMessageStats(checked as boolean)
            }
          />
          <label
            htmlFor="showStats"
            className="ml-2 text-sm font-medium text-black cursor-pointer"
          >
            Show response stats
          </label>
        </div>
        <div className="flex items-center mb-4">
          <DollarSign className="w-4 h-4 mr-2 text-green-500" />
          <span className="text-sm font-medium text-black">
            ${formatNumber(totalSaved)} saved
          </span>
        </div>
        <div className="flex items-center mb-4">
          <Hash className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-sm font-medium text-black">
            {totalTokens} tokens
          </span>
        </div>
        <div className="space-y-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block text-black">
              Cost
            </label>
            <Popover open={isAdjustingCost}>
              <PopoverTrigger asChild>
                <Slider
                  value={[costPreference]}
                  onValueChange={(value) => setCostPreference(value[0])}
                  onValueCommit={() => setIsAdjustingCost(false)}
                  max={100}
                  step={1}
                  onPointerDown={() => setIsAdjustingCost(true)}
                  onPointerUp={() => setIsAdjustingCost(false)}
                  onPointerMove={handleSliderPointerMove}
                  className="w-full"
                />
              </PopoverTrigger>
              <PopoverContent
                className="px-2 py-1 w-auto h-auto text-xs transition-all duration-100"
                style={{
                  position: "absolute",
                  left: `${popoverPosition.x}px`,
                  top: `${popoverPosition.y}px`,
                  transform: "translateX(-50%)",
                }}
              >
                {costPreference}
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-black">
              Quality
            </label>
            <Popover open={isAdjustingQuality}>
              <PopoverTrigger asChild>
                <Slider
                  value={[qualityPreference]}
                  onValueChange={(value) => setQualityPreference(value[0])}
                  onValueCommit={() => setIsAdjustingQuality(false)}
                  max={100}
                  step={1}
                  onPointerDown={() => setIsAdjustingQuality(true)}
                  onPointerUp={() => setIsAdjustingQuality(false)}
                  onPointerMove={handleSliderPointerMove}
                  className="w-full"
                />
              </PopoverTrigger>
              <PopoverContent
                className="px-2 py-1 w-auto h-auto text-xs transition-all duration-100"
                style={{
                  position: "absolute",
                  left: `${popoverPosition.x}px`,
                  top: `${popoverPosition.y}px`,
                  transform: "translateX(-50%)",
                }}
              >
                {qualityPreference}
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-black">
              Latency
            </label>
            <Popover open={isAdjustingLatency}>
              <PopoverTrigger asChild>
                <Slider
                  value={[latencyPreference]}
                  onValueChange={(value) => setLatencyPreference(value[0])}
                  onValueCommit={() => setIsAdjustingLatency(false)}
                  max={100}
                  step={1}
                  onPointerDown={() => setIsAdjustingLatency(true)}
                  onPointerUp={() => setIsAdjustingLatency(false)}
                  onPointerMove={handleSliderPointerMove}
                  className="w-full"
                />
              </PopoverTrigger>
              <PopoverContent
                className="px-2 py-1 w-auto h-auto text-xs transition-all duration-100"
                style={{
                  position: "absolute",
                  left: `${popoverPosition.x}px`,
                  top: `${popoverPosition.y}px`,
                  transform: "translateX(-50%)",
                }}
              >
                {latencyPreference}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
