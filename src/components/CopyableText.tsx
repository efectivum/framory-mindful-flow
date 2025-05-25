
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CopyableTextProps {
  text: string;
  className?: string;
  showButton?: boolean;
}

export const CopyableText = ({ text, className = "", showButton = true }: CopyableTextProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers or when clipboard API fails
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopied(true);
        toast({
          title: "Copied!",
          description: "Text copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        toast({
          title: "Copy failed",
          description: "Please select and copy manually",
          variant: "destructive",
        });
      }
      
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className={`flex items-center gap-2 p-3 bg-gray-50 rounded-lg border ${className}`}>
      <div className="flex-1 font-mono text-sm break-all select-all">
        {text}
      </div>
      {showButton && (
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};
