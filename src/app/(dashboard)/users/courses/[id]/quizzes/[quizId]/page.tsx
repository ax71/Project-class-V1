"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Pastikan path ini benar
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { quizService } from "@/services/quiz.service";
import { progressService } from "@/services/progress.service";
import { certificateService } from "@/services/certificate.service";
import { Quiz, Question, Answer } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  Award,
  Loader2,
} from "lucide-react";

export default function QuizTakingPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  const quizId = Number(params.quizId); // Pastikan nama param di folder [quizId] sesuai

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State loading saat submit
  const [courseComplete, setCourseComplete] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const quizData = await quizService.getQuizById(quizId);
      setQuiz(quizData);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      fetchData();
    }
  }, [quizId]);

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (!quiz?.questions) return;
    setIsSubmitting(true); // Aktifkan loading tombol

    try {
      // 1. Hitung Score Lokal
      let correctCount = 0;
      quiz.questions.forEach((question) => {
        const selectedAnswerId = answers[question.id];
        const correctAnswer = question.answers?.find((a) => a.is_correct);
        if (selectedAnswerId === correctAnswer?.id) {
          correctCount++;
        }
      });

      setScore(correctCount);
      setSubmitted(true);

      // 2. Kirim Progress ke Backend
      // Kita kirim 'quiz_id' dan is_completed: true (asumsi lulus berapapun nilainya, atau sesuaikan logika backend)
      const result = await progressService.updateProgress(
        courseId,
        null, // Material ID null
        true, // Completed
        quizId // Quiz ID terisi
      );

      console.log(`✅ Quiz completed! Progress: ${result.data.percentage}%`);

      // 3. Cek Sertifikat (Jika 100%)
      if (result.data.percentage === 100) {
        setCourseComplete(true);
        try {
          await certificateService.generateCertificate(courseId);
          setShowCertificateModal(true);
        } catch (error: any) {
          if (error.response?.status === 409) {
            console.log("Certificate already exists");
            setShowCertificateModal(true);
          }
        }
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      alert("Failed to submit quiz result. Please try again.");
    } finally {
      setIsSubmitting(false); // Matikan loading tombol
    }
  };

  const isAnswerCorrect = (questionId: number): boolean => {
    const question = quiz?.questions?.find((q) => q.id === questionId);
    if (!question) return false;
    const selectedAnswerId = answers[questionId];
    const correctAnswer = question.answers?.find((a) => a.is_correct);
    return selectedAnswerId === correctAnswer?.id;
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading quiz..." />;
  }

  if (error || !quiz) {
    return (
      <ErrorMessage message={error || "Quiz not found"} onRetry={fetchData} />
    );
  }

  // Validasi Tambahan: Pastikan pertanyaan ada
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">
          No questions available for this quiz.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  // Logic Tombol Aktif: Semua pertanyaan harus dijawab
  const allAnswered = Object.keys(answers).length === totalQuestions;

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Certificate Celebration Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <Card className="max-w-md w-full p-6 text-center shadow-2xl">
            <div className="mb-4">
              <Trophy
                className="mx-auto text-yellow-500 animate-bounce"
                size={80}
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              You've completed the entire course!
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/users/certificates")}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
              >
                <Award className="mr-2" size={18} />
                View Certificate
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCertificateModal(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push(`/users/courses/${courseId}`)}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Course
      </Button>

      {/* Quiz Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {quiz.description}
          </CardDescription>

          {submitted && (
            <div
              className={`mt-6 p-6 rounded-lg border ${
                percentage >= 70
                  ? "bg-green-50 border-green-200"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <h3 className="text-xl font-bold mb-1">
                Your Score:{" "}
                <span
                  className={
                    percentage >= 70 ? "text-green-600" : "text-orange-600"
                  }
                >
                  {score} / {totalQuestions}
                </span>
              </h3>
              <p className="text-gray-600 mb-2">
                Result: {percentage.toFixed(0)}%
              </p>

              <div className="flex items-center gap-2 font-medium">
                {percentage >= 70 ? (
                  <>
                    <CheckCircle className="text-green-600" />
                    <span className="text-green-700">Passed! Great job.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-orange-600" />
                    <span className="text-orange-700">
                      Don't give up! Try again to improve.
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Questions List */}
      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 pb-4">
              <CardTitle className="text-lg flex items-start gap-3">
                <span className="flex items-center justify-center bg-blue-100 text-blue-700 rounded-full w-8 h-8 text-sm flex-shrink-0">
                  {index + 1}
                </span>
                <span className="mt-1">{question.question_text}</span>

                {submitted && (
                  <span className="ml-auto flex-shrink-0">
                    {isAnswerCorrect(question.id) ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">
                        <CheckCircle size={16} /> Correct
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600 text-sm font-medium bg-red-50 px-2 py-1 rounded">
                        <XCircle size={16} /> Wrong
                      </div>
                    )}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={(value) =>
                  !submitted && handleAnswerChange(question.id, Number(value))
                }
                disabled={submitted} // Disable input setelah submit
                className="space-y-3"
              >
                {question.answers?.map((answer) => {
                  const isSelected = answers[question.id] === answer.id;
                  const isCorrect = answer.is_correct;

                  // Styling Logika untuk Hasil
                  let borderClass = "border-gray-200 hover:border-blue-300";
                  let bgClass = "hover:bg-gray-50";

                  if (submitted) {
                    if (isCorrect) {
                      borderClass = "border-green-500 ring-1 ring-green-500";
                      bgClass = "bg-green-50/50";
                    } else if (isSelected && !isCorrect) {
                      borderClass = "border-red-500";
                      bgClass = "bg-red-50/50";
                    } else {
                      bgClass = "opacity-50"; // Jawaban lain jadi agak transparan
                    }
                  } else if (isSelected) {
                    borderClass = "border-blue-500 ring-1 ring-blue-500";
                    bgClass = "bg-blue-50/30";
                  }

                  return (
                    <div
                      key={answer.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${borderClass} ${bgClass}`}
                    >
                      <RadioGroupItem
                        value={answer.id.toString()}
                        id={`q${question.id}-a${answer.id}`}
                        className="text-blue-600"
                      />
                      <Label
                        htmlFor={`q${question.id}-a${answer.id}`}
                        className="flex-1 cursor-pointer text-sm md:text-base"
                      >
                        {answer.answer_text}
                      </Label>

                      {/* Indikator Icon di sebelah kanan */}
                      {submitted && isCorrect && (
                        <CheckCircle className="text-green-600" size={18} />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle className="text-red-500" size={18} />
                      )}
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-6 flex justify-center py-4 z-10">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8 py-6 text-lg rounded-full transition-transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
              </>
            ) : (
              `Submit Quiz (${Object.keys(answers).length}/${totalQuestions})`
            )}
          </Button>
        ) : (
          <div className="flex gap-4 bg-white dark:bg-gray-900 p-2 rounded-full shadow-lg border">
            <Button
              onClick={() => router.push(`/users/courses/${courseId}`)}
              variant="ghost"
              className="rounded-full px-6"
            >
              Back to Course
            </Button>
            <Button
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
                setScore(0);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-blue-600 hover:bg-blue-700 rounded-full px-6"
            >
              Retake Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
