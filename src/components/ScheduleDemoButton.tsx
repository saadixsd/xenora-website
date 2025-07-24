import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface ScheduleDemoButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

const ScheduleDemoButton = ({ className = "", size = "default" }: ScheduleDemoButtonProps) => {
  return (
    <Button 
      asChild 
      size={size}
      className={`bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 ${className}`}
    >
      <Link to="/contact">
        <Calendar className="h-4 w-4 mr-2" />
        Schedule Demo
      </Link>
    </Button>
  );
};

export default ScheduleDemoButton;