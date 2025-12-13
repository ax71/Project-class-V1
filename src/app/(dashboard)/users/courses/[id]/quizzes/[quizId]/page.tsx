"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Quiz, Question, Answer } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function QuizTakingPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  const quizId = Number(params.quizId);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const quizData = await quizService.getQuizById(quizId);
      setQuiz(quizData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [quizId]);

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = () => {
    if (!quiz?.questions) return;

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
  };

  const getCorrectAnswer = (question: Question): Answer | undefined => {
    return question.answers?.find((a) => a.is_correct);
  };

  const isAnswerCorrect = (questionId: number): boolean => {
    const question = quiz?.questions?.find((q) => q.id === questionId);
    const selectedAnswerId = answers[questionId];
    const correctAnswer = getCorrectAnswer(question!);
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

  const totalQuestions = quiz.questions?.length || 0;
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
  const allAnswered =
    Object.keys(answers).length === totalQuestions && totalQuestions > 0;

  return (
    <div className="w-full space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push(`/users/courses/${courseId}`)}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Course
      </Button>

      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <CardDescription>{quiz.description}</CardDescription>
          {submitted && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h3 className="text-lg font-semibold">
                Your Score: {score} / {totalQuestions} ({percentage.toFixed(0)}
                %)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {percentage >= 70
                  ? "🎉 Congratulations! You passed!"
                  : "Keep learning and try again!"}
              </p>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions?.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-start gap-2">
                <span className="text-blue-500">Q{index + 1}.</span>
                <span>{question.question_text}</span>
                {submitted && (
                  <span className="ml-auto">
                    {isAnswerCorrect(question.id) ? (
                      <CheckCircle className="text-green-500" size={24} />
                    ) : (
                      <XCircle className="text-red-500" size={24} />
                    )}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={(value) =>
                  handleAnswerChange(question.id, Number(value))
                }
                disabled={submitted}
              >
                {question.answers?.map((answer) => {
                  const isSelected = answers[question.id] === answer.id;
                  const isCorrect = answer.is_correct;
                  const showCorrect = submitted && isCorrect;
                  const showWrong = submitted && isSelected && !isCorrect;

                  return (
                    <div
                      key={answer.id}
                      className={`flex items-center space-x-2 p-3 rounded-lg border ${
                        showCorrect
                          ? "bg-green-50 border-green-500 dark:bg-green-900"
                          : showWrong
                          ? "bg-red-50 border-red-500 dark:bg-red-900"
                          : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem
                        value={answer.id.toString()}
                        id={`answer-${answer.id}`}
                      />
                      <Label
                        htmlFor={`answer-${answer.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {answer.answer_text}
                      </Label>
                      {showCorrect && (
                        <CheckCircle className="text-green-500" size={20} />
                      )}
                      {showWrong && (
                        <XCircle className="text-red-500" size={20} />
                      )}
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="bg-green-500 hover:bg-green-600 px-8"
            size="lg"
          >
            Submit Quiz
          </Button>
        </div>
      )}

      {submitted && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => router.push(`/users/courses/${courseId}`)}
            variant="outline"
          >
            Back to Course
          </Button>
          <Button
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
              setScore(0);
            }}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Retake Quiz
          </Button>
        </div>
      )}
    </div>
  );
}
