import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div>hello World</div>
      <Button>Click me</Button>
      <DarkmodeToggle />
    </div>
  );
}
