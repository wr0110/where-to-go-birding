import Button from "components/Button";
import { RefreshIcon } from "@heroicons/react/outline";

interface SubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  [x: string]: any;
}

export default function Submit({ loading, disabled, children, ...props }: SubmitProps) {
  return (
    <Button type="submit" disabled={disabled || loading} {...props}>
      {loading ? <RefreshIcon className="h-7 w-7 animate-spin" /> : children}
    </Button>
  );
}
