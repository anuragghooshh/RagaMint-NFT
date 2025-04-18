import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GemIcon } from "lucide-react";

const getRarityColor = (score) => {
  if (score >= 90)
    return "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/50";
  if (score >= 75)
    return "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/50";
  if (score >= 60)
    return "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/50";
  if (score >= 40)
    return "bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/50";
  return "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 border-gray-500/50";
};

const getRarityLabel = (score) => {
  if (score >= 90) return "Legendary";
  if (score >= 75) return "Epic";
  if (score >= 60) return "Rare";
  if (score >= 40) return "Uncommon";
  return "Common";
};

const RarityBadge = ({ score, reasons }) => {
  if (!score) return null;

  const rarityClass = getRarityColor(score);
  const rarityLabel = getRarityLabel(score);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Badge
            className={`${rarityClass} flex items-center gap-1.5 cursor-pointer`}
          >
            <GemIcon className="h-3.5 w-3.5" />
            <span>
              {rarityLabel} • {score}/100
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div>
            <p className="font-semibold mb-1">Rarity factors:</p>
            <ul className="list-disc list-inside text-sm">
              {reasons ? (
                reasons.map((reason, index) => (
                  <li key={index} className="text-xs">
                    {reason}
                  </li>
                ))
              ) : (
                <li className="text-xs">No details available</li>
              )}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RarityBadge;
