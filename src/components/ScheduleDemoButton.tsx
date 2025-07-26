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
      className={`bg-gradient-to-r from-primary to-[hsl(280,100%,70%)] text-white hover:shadow-lg hover:scale-105 transition-all duration-300 ${className}`}
    >
      <Link to="/contact">
        <Calendar className="h-4 w-4 mr-2" />
        Schedule Demo
      </Link>
    </Button>
  );
};

export default ScheduleDemoButton;