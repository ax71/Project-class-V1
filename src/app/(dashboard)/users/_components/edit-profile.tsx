"use client";

import { useState, useEffect } from "react"; // Tambahkan useEffect
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/services/auth.service";
import { Loader2, User, Mail, X, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: { name: string; email: string };
}

export function EditProfileDialog({
  open,
  onOpenChange,
  currentUser,
}: EditProfileDialogProps) {
  const [name, setName] = useState(currentUser.name);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- PERBAIKAN DI SINI (SOLUSI MASALAH ANDA) ---
  // Gunakan useEffect untuk memantau perubahan pada currentUser.
  // Setiap kali data user berubah (atau dialog dibuka), reset state 'name' agar sesuai data terbaru.
  useEffect(() => {
    setName(currentUser.name);
  }, [currentUser, open]); // Dijalankan saat data user berubah ATAU saat dialog dibuka

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Nama tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      await updateProfile(name);

      const oldUserData = JSON.parse(localStorage.getItem("user") || "{}");
      const newUserData = { ...oldUserData, name: name };
      localStorage.setItem("user", JSON.stringify(newUserData));

      onOpenChange(false);
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error("Gagal update profile", error);
      alert("Gagal mengupdate profil. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden gap-0 rounded-2xl shadow-xl border-0">
        {/* --- HEADER --- */}
        <DialogHeader className="p-6 pb-2 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
              Edit Profil
            </DialogTitle>

            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-black/5"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          <DialogDescription className="text-gray-500 dark:text-gray-400 mt-1.5">
            Perbarui informasi profil Anda. Nama ini akan dicetak pada
            sertifikat kelulusan.
          </DialogDescription>
        </DialogHeader>

        {/* --- CONTENT FORM --- */}
        <div className="p-6 space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Email Akun
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
              <Input
                id="email"
                value={currentUser.email}
                disabled
                className="pl-9 bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed font-mono text-sm"
              />
            </div>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <CheckCircle size={10} /> Email terverifikasi
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400"
            >
              Nama Lengkap (Sertifikat)
            </Label>
            <div className="relative group">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 border-blue-100 focus:border-blue-500 focus:ring-blue-500/20 transition-all font-medium text-gray-800 dark:text-gray-100"
                placeholder="Masukkan nama lengkap..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Pastikan ejaan nama sudah benar sesuai kartu identitas.
            </p>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <DialogFooter className="p-6 pt-2 bg-gray-50/50 dark:bg-gray-800/50 flex flex-row gap-3 justify-end items-center">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Batal
          </Button>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={loading || !name.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
