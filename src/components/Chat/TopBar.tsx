import React from "react";
import { Button } from "antd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu, HelpCircle, Hash, DollarSign, PiggyBank } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarContent from "@/components/Chat/ChatSideBar";

interface TopBarProps {
  totalTokens: number;
  totalCost: number;
  totalSavings: number;
  onAddWindow: () => void;
  onHelp: () => void;
  onInfoClick: (type: string) => void;
  selectedProviders: string[];
  setSelectedProviders: React.Dispatch<React.SetStateAction<string[]>>;
  showMessageStats: boolean;
  setShowMessageStats: React.Dispatch<React.SetStateAction<boolean>>;
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  totalTokens,
  totalCost,
  totalSavings,
  onHelp,
  onInfoClick,
  selectedProviders,
  setSelectedProviders,
  showMessageStats,
  setShowMessageStats,
}) => {
  return (
    <div className="p-4 flex items-center justify-between border-b border-gray-200">
      <Sheet>
        <SheetTrigger asChild>
          <Button type="default" size="small" className="w-8 h-8 p-0">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-white">
          <SidebarContent
            selectedProviders={selectedProviders}
            setSelectedProviders={setSelectedProviders}
            showMessageStats={showMessageStats}
            setShowMessageStats={setShowMessageStats}
          />
        </SheetContent>
      </Sheet>

      <div className="flex items-center space-x-4">
        <div className="flex items-center h-10 bg-gray-100 rounded-md px-3 space-x-2">
          {/* Token Info */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => onInfoClick("tokens")}
              >
                <Hash className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">
                  {formatNumber(totalTokens)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total tokens used</p>
            </TooltipContent>
          </Tooltip>
          <div className="w-px h-6 bg-gray-300"></div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => onInfoClick("cost")}
              >
                <DollarSign className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">
                  ${totalCost.toFixed(3)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total cost</p>
            </TooltipContent>
          </Tooltip>
          <div className="w-px h-6 bg-gray-300"></div>
          {/* Savings Info */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => onInfoClick("savings")}
              >
                <PiggyBank className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">
                  ${totalSavings.toFixed(3)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total savings</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {/* Add Window Button */}
        {/* <Button
          type="default"
          size="small"
          onClick={onAddWindow}
          className="w-10 h-10"
        >
          <Plus className="h-4 w-4" />
        </Button> */}
        {/* Help Button */}
        <Button
          type="default"
          size="small"
          onClick={onHelp}
          className="w-10 h-10"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
