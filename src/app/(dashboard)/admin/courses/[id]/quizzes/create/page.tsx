"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { quizService } from "@/services/quiz.service";
import { Plus, Trash2, AlertCircle, ArrowLeft } from "lucide-react";

interface QuestionData {
  question_text: string;
  answers: {
    answer_text: string;
    is_correct: boolean;
  }[];
}

export default function CreateQuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionData[]>([
    {
      question_text: "",
      answers: [
        { answer_text: "", is_correct: false },
        { answer_text: "", is_correct: false },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        answers: [
          { answer_text: "", is_correct: false },
          { answer_text: "", is_correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (qIndex: number) => {
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const updateQuestion = (qIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].question_text = text;
    setQuestions(updated);
  };

  const addAnswer = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers.push({ answer_text: "", is_correct: false });
    setQuestions(updated);
  };

  const removeAnswer = (qIndex: number, aIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers = updated[qIndex].answers.filter(
      (_, i) => i !== aIndex
    );
    setQuestions(updated);
  };

  const updateAnswer = (qIndex: number, aIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex].answer_text = text;
    setQuestions(updated);
  };

  const toggleCorrect = (qIndex: number, aIndex: number) => {
    const updated = [...questions];
    // Set all answers to false first
    updated[qIndex].answers.forEach((a) => (a.is_correct = false));
    // Set the selected answer to true
    updated[qIndex].answers[aIndex].is_correct = true;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!quizTitle.trim()) {
      setError("Quiz title is required");
      return;
    }

    if (questions.length === 0) {
      setError("At least one question is required");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      if (q.answers.length < 2) {
        setError(`Question ${i + 1} must have at least 2 answers`);
        return;
      }
      if (!q.answers.some((a) => a.is_correct)) {
        setError(`Question ${i + 1} must have one correct answer`);
        return;
      }
      for (let j = 0; j < q.answers.length; j++) {
        if (!q.answers[j].answer_text.trim()) {
          setError(`Question ${i + 1}, Answer ${j + 1} text is required`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      // Create quiz
      const quiz = await quizService.createQuiz({
        course_id: courseId,
        title: quizTitle,
        description: quizDescription || "Quiz for this course",
      });

      // Create questions
      for (const question of questions) {
        await quizService.createQuestion({
          quiz_id: quiz.id,
          question_text: question.question_text,
          answers: question.answers,
        });
      }

      alert("✅ Quiz created successfully!");
      router.push(`/admin/courses_taught/${courseId}/quizzes`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/courses_taught/${courseId}/quizzes`)}
          className="flex items-center gap-2 mb-2"
        >
          <ArrowLeft size={16} />
          Back to Quizzes
        </Button>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Create New Quiz
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Info */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Enter quiz description"
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        {questions.map((question, qIndex) => (
          <Card key={qIndex}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Question {qIndex + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Question Text</Label>
                <Input
                  value={question.question_text}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                  placeholder="Enter question"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Answers</Label>
                {question.answers.map((answer, aIndex) => (
                  <div key={aIndex} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={answer.is_correct}
                      onChange={() => toggleCorrect(qIndex, aIndex)}
                      className="w-4 h-4"
                      disabled={loading}
                    />
                    <Input
                      value={answer.answer_text}
                      onChange={(e) =>
                        updateAnswer(qIndex, aIndex, e.target.value)
                      }
                      placeholder={`Answer ${aIndex + 1}`}
                      required
                      disabled={loading}
                      className="flex-1"
                    />
                    {question.answers.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAnswer(qIndex, aIndex)}
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addAnswer(qIndex)}
                  disabled={loading}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add Answer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          disabled={loading}
          className="w-full"
        >
          <Plus size={16} className="mr-2" />
          Add Question
        </Button>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Quiz"}
          </Button>
        </div>
      </form>
    </div>
  );
}
