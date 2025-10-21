import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import Image from "next/image";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative bg-muted min-h-svh  flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <DarkmodeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-1 self-center font-bold text-1xl">
          <div className="flex p-2 items-center justify-center rounded-md">
            <Image src="/Icon.svg" alt="Positivus" width={48} height={48} />
          </div>
          Positivus
        </div>
        {children}
      </div>
    </div>
  );
}
