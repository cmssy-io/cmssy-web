import { SendIcon } from "./icons";

interface SuccessMessageProps {
  heading: string;
  message: string;
}

export function SuccessMessage({ heading, message }: SuccessMessageProps) {
  return (
    <div className="rounded-lg border bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <SendIcon className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{heading}</h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
