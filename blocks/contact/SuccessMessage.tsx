import { Send } from "lucide-react";

interface SuccessMessageProps {
  heading: string;
  message: string;
}

export function SuccessMessage({ heading, message }: SuccessMessageProps) {
  return (
    <div className="py-8 text-center">
      <Send className="mx-auto mb-4 size-5 text-elektryk" aria-hidden="true" />
      <h3 className="mb-2 font-heading text-h3 font-semibold">{heading}</h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
