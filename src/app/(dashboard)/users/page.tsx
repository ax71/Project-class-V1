import Image from "next/image";

export default function UserDashboard() {
  return (
    <div className="w-full h-full">
      <div className="w-full bg-gradient-to-r from-sky-300 to-sky-400 rounded-lg shadow-md p-8 md:p-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Good Day, Bukti!
          </h1>
          <p className="text-lg md:text-xl text-black font-mono">
            Ready start your day with Positivus?
          </p>
        </div>

        <div className="ml-8">
          <Image
            src="/Illustration-1.svg"
            alt="User Dashboard Illustration"
            width={300}
            height={200}
            priority
          />
        </div>
      </div>
    </div>
  );
}
