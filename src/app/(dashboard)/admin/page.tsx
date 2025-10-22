import Image from "next/image";

export default function AdminDashboard() {
  return (
    <div className="w-full h-full">
      <div className="w-full bg-gradient-to-r from-sky-300 to-sky-400 rounded-lg shadow-md p-8 md:p-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Welcome to your Dashboard 🎓
          </h1>
          <p className="mt-9 text-lg md:text-sm text-black font-mono">
            Monitor activities, manage courses, and support better learning
            outcomes for your students. Let’s make today productive!
          </p>
        </div>

        <div className="ml-8">
          <Image
            src="/Illustration-1.svg"
            alt="User Dashboard Illustration"
            width={300}
            height={300}
            priority
          />
        </div>
      </div>
    </div>
  );
}
