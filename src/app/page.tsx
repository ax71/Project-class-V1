import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src="/Icon.svg"
            alt="Positivus"
            width={42}
            height={42}
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Positivus
          </h1>
        </div>

        <div className="flex space-x-4">
          <Button variant="outline">Register</Button>
          <Button className="bg-blue-500 dark:text-white">Sign In</Button>
          <div className="">
            <DarkmodeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 border-2 border-blue-200 rounded-full opacity-30"></div>
          <div className="absolute -top-5 -left-5 w-80 h-80 border-2 border-blue-200 rounded-full opacity-20"></div>
          <div className="absolute top-0 left-0 w-96 h-96 border-2 border-blue-200 rounded-full opacity-10"></div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            It’s <span className="text-blue-500">Time to Grow</span> <br />
            with <span className="text-blue-500">Positivus</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
            At Positivus, we are here to guide your learning journey with a fun,
            flexible, and meaningful approach.
          </p>
          <Button className="bg-blue-500 dark:text-white size-lg">
            Get Started
          </Button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-16 bg-gray-200 dark:bg-gray-700 rounded-full blur-xl opacity-60"></div>

            <Image
              src="Illustration-1.svg"
              alt="Gambar Illustration"
              height={400}
              width={400}
            />
            <div className="absolute -top-4 -right-4 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full opacity-20"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
