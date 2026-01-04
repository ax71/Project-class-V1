import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Users,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  // Data dummy untuk fitur dan course (bisa dipindah ke database nanti)
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Fleksibilitas Waktu",
      description:
        "Akses materi kapan saja dan di mana saja sesuai kecepatan belajarmu.",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Komunitas Belajar",
      description:
        "Bergabung dengan ribuan siswa lain dan mentor berpengalaman.",
    },
    {
      icon: <Award className="w-6 h-6 text-blue-500" />,
      title: "Sertifikat Resmi",
      description:
        "Dapatkan sertifikat terverifikasi setelah menyelesaikan kursus.",
    },
  ];

  const courses = [
    {
      title: "Fullstack Web Development",
      category: "Programming",
      lessons: 24,
      image: "/course-1.jpg", // Pastikan ada placeholder atau ganti src
    },
    {
      title: "UI/UX Design Mastery",
      category: "Design",
      lessons: 18,
      image: "/course-2.jpg",
    },
    {
      title: "Digital Marketing 101",
      category: "Marketing",
      lessons: 12,
      image: "/course-3.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/Icon.svg" alt="Positivus" width={32} height={32} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Positivus
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/register" className="hidden md:block">
              <Button variant="ghost">Register</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign In
              </Button>
            </Link>
            <DarkmodeToggle />
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 container mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900 dark:text-white">
            It’s <span className="text-blue-600">Time</span> to{" "}
            <span className="text-blue-600">Grow</span>
            <br />
            with <span className="text-blue-600">Positivus</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg text-lg">
            Kami hadir untuk memandu perjalanan belajarmu dengan pendekatan yang
            menyenangkan, fleksibel, dan bermakna untuk karir masa depan.
          </p>
          <div className="flex gap-4">
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-lg rounded-full">
                Mulai Belajar
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-12 px-8 text-lg rounded-full"
            >
              Lihat Katalog
            </Button>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
          <Image
            src="/Illustration-1.svg"
            alt="Learning Illustration"
            height={600}
            width={600}
            priority
            className="relative z-10 drop-shadow-2xl"
          />
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800/50 py-12 border-y dark:border-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Siswa Aktif", value: "100+" },
            { label: "Total Kursus", value: "10+" },
            { label: "Mentor Expert", value: "50+" },
            { label: "Rating Kepuasan", value: "4.4/5" },
          ].map((stat, idx) => (
            <div key={idx}>
              <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Kenapa Belajar di Positivus?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Metode pembelajaran kami dirancang khusus untuk memaksimalkan
            potensi Anda dalam waktu yang efisien.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white dark:bg-gray-950 py-12 border-t dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image src="/Icon.svg" alt="Positivus" width={32} height={32} />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              Positivus
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            &copy; {new Date().getFullYear()} Positivus Learning Platform. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
