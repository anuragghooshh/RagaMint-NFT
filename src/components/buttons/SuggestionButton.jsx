import { Loader2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

const SuggestionButton = ({ onClick, loading, disabled }) => {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="ghost"
      className="h-8 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
      disabled={loading || disabled}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Suggest
        </span>
      )}
    </Button>
  );
};


export default SuggestionButton;