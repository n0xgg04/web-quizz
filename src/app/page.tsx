"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { analytics } from "@/utils/firebase";
import { logEvent } from "firebase/analytics";
import htmlQuestions from "@/assets/html.json";
import cssQuestions from "@/assets/css.json";
import jsQuestions from "@/assets/js.json";
import phpQuestions from "@/assets/php.json";
import mysqlQuestions from "@/assets/mysql.json";
import jqueryQuestions from "@/assets/jquery.json";
import bootstrapQuestions from "@/assets/bootstrap.json";
import bootstrap4Questions from "@/assets/bootstrap4.json";
import bootstrap5Questions from "@/assets/bootstap5.json";
import xmlQuestions from "@/assets/xml.json";

interface Question {
  question: string;
  option: string[];
  correct: number;
}

interface QuizSettings {
  topics: string[];
  shuffle: boolean;
  mode: "practice" | "exam";
  questionCount?: number;
}

export default function Home() {
  const [settings, setSettings] = useState<QuizSettings>({
    topics: [],
    shuffle: false,
    mode: "practice",
  });
  const [currentStep, setCurrentStep] = useState<"setup" | "quiz">("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const topicOptions = [
    { id: "html", label: "HTML", questions: htmlQuestions },
    { id: "css", label: "CSS", questions: cssQuestions },
    { id: "js", label: "JavaScript", questions: jsQuestions },
    { id: "php", label: "PHP", questions: phpQuestions },
    { id: "mysql", label: "MySQL", questions: mysqlQuestions },
    { id: "jquery", label: "jQuery", questions: jqueryQuestions },
    { id: "bootstrap", label: "Bootstrap 3", questions: bootstrapQuestions },
    { id: "bootstrap4", label: "Bootstrap 4", questions: bootstrap4Questions },
    { id: "bootstrap5", label: "Bootstrap 5", questions: bootstrap5Questions },
    { id: "xml", label: "XML", questions: xmlQuestions },
  ];

  const handleTopicChange = (topicId: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      topics: checked
        ? [...prev.topics, topicId]
        : prev.topics.filter((t) => t !== topicId),
    }));
  };

  const startQuiz = () => {
    if (settings.topics.length === 0) return;

    if (analytics) {
      settings.topics.forEach((topicId) => {
        logEvent(analytics, "select_content", {
          content_type: "quiz_topic",
          item_id: topicId,
        });
      });

      const eventParams = {
        topics: settings.topics.join(", "),
        shuffle: String(settings.shuffle),
      };

      if (settings.mode === "practice") {
        logEvent(analytics, "user_in_practice", eventParams);
      } else if (settings.mode === "exam") {
        logEvent(analytics, "user_in_test", {
          ...eventParams,
          question_count: settings.questionCount,
        });
      }
    }

    let allQuestions: Question[] = [];

    settings.topics.forEach((topicId) => {
      const topic = topicOptions.find((t) => t.id === topicId);
      if (topic) {
        allQuestions = [...allQuestions, ...topic.questions];
      }
    });

    if (settings.shuffle) {
      allQuestions = allQuestions.sort(() => Math.random() - 0.5);
    }

    if (settings.mode === "exam" && settings.questionCount) {
      allQuestions = allQuestions.slice(0, settings.questionCount);
    }

    setQuestions(allQuestions);
    setSelectedAnswers(new Array(allQuestions.length).fill(-1));
    setCurrentQuestionIndex(0);
    setShowAnswers(false);
    setScore(null);
    setCurrentStep("quiz");
  };

  const handleAnswerSelect = (answerIndex: number, questionIndex?: number) => {
    const newAnswers = [...selectedAnswers];
    const targetIndex =
      questionIndex !== undefined ? questionIndex : currentQuestionIndex;
    newAnswers[targetIndex] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (settings.mode === "practice") {
      setShowAnswers(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswers(false);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswers(false);
    }
  };

  const submitQuiz = () => {
    let correctCount = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowAnswers(true);

    if (analytics) {
      logEvent(analytics, "user_done_test", {
        score: correctCount,
        total_questions: questions.length,
        topics: settings.topics.join(", "),
      });
    }
  };

  const resetQuiz = () => {
    if (currentStep === "quiz" && settings.mode === "practice" && analytics) {
      logEvent(analytics, "user_done_practice", {
        topics: settings.topics.join(", "),
        questions_viewed: currentQuestionIndex + 1,
      });
    }

    setCurrentStep("setup");
    setSettings({
      topics: [],
      shuffle: false,
      mode: "practice",
    });
  };

  if (currentStep === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-indigo-800">
                Web Development Quiz
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Chọn chủ đề và chế độ để bắt đầu bài kiểm tra
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Chọn chủ đề</CardTitle>
                <CardDescription>
                  Chọn một hoặc nhiều chủ đề để kiểm tra
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {topicOptions.map((topic) => (
                  <div key={topic.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={topic.id}
                      checked={settings.topics.includes(topic.id)}
                      onCheckedChange={(checked) =>
                        handleTopicChange(topic.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={topic.id} className="text-lg">
                      {topic.label} ({topic.questions.length} câu hỏi)
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cài đặt</CardTitle>
                <CardDescription>Tùy chỉnh cách thức kiểm tra</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Chế độ</Label>
                  <RadioGroup
                    value={settings.mode}
                    onValueChange={(value: "practice" | "exam") =>
                      setSettings((prev) => ({ ...prev, mode: value }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="practice" id="practice" />
                      <Label htmlFor="practice">
                        Luyện tập (xem đáp án ngay)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exam" id="exam" />
                      <Label htmlFor="exam">
                        Thi thử (nộp bài để xem điểm)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {settings.mode === "exam" && (
                  <div className="space-y-2">
                    <Label htmlFor="questionCount">Số câu hỏi</Label>
                    <Select
                      value={settings.questionCount?.toString() || "10"}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          questionCount: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 câu</SelectItem>
                        <SelectItem value="10">10 câu</SelectItem>
                        <SelectItem value="15">15 câu</SelectItem>
                        <SelectItem value="20">20 câu</SelectItem>
                        <SelectItem value="30">30 câu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shuffle"
                    checked={settings.shuffle}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        shuffle: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="shuffle">Trộn câu hỏi</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={startQuiz}
              disabled={settings.topics.length === 0}
              className="px-8 py-3 text-lg"
            >
              Bắt đầu kiểm tra
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "quiz") {
    if (settings.mode === "practice") {
      const currentQuestion = questions[currentQuestionIndex];
      const isLastQuestion = currentQuestionIndex === questions.length - 1;
      const isAnswerCorrect =
        selectedAnswers[currentQuestionIndex] === currentQuestion.correct;

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {currentQuestion.question}
                  </h2>

                  <RadioGroup
                    value={
                      selectedAnswers[currentQuestionIndex]?.toString() || ""
                    }
                    onValueChange={(value) =>
                      handleAnswerSelect(parseInt(value))
                    }
                  >
                    {currentQuestion.option.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-3"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`option-${index}`}
                          disabled={showAnswers}
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className={`text-lg cursor-pointer ${
                            showAnswers && index === currentQuestion.correct
                              ? "text-green-600 font-bold"
                              : showAnswers &&
                                index ===
                                  selectedAnswers[currentQuestionIndex] &&
                                index !== currentQuestion.correct
                              ? "text-red-600 font-bold"
                              : ""
                          }`}
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {showAnswers && (
                    <div className="mt-4 p-4 rounded-lg bg-gray-50">
                      <div
                        className={`font-semibold ${
                          isAnswerCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isAnswerCorrect ? "✓ Đúng!" : "✗ Sai!"}
                      </div>
                      <div className="mt-2">
                        <strong>Đáp án đúng:</strong>{" "}
                        {currentQuestion.option[currentQuestion.correct]}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Câu trước
              </Button>

              <div className="flex gap-2">
                {showAnswers && !isLastQuestion && (
                  <Button onClick={nextQuestion}>Câu tiếp</Button>
                )}
              </div>

              <Button variant="outline" onClick={resetQuiz}>
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (settings.mode === "exam") {
      const answeredCount = selectedAnswers.filter((a) => a !== -1).length;

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-6xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">
                    Bài thi thử - {questions.length} câu hỏi
                  </CardTitle>
                  <div className="text-lg">
                    <span className="font-semibold text-indigo-600">
                      Đã trả lời: {answeredCount}/{questions.length}
                    </span>
                  </div>
                </div>
                {score !== null && (
                  <div className="text-center mt-4">
                    <div className="text-3xl font-bold text-indigo-600">
                      Điểm: {score}/{questions.length} (
                      {Math.round((score / questions.length) * 100)}%)
                    </div>
                  </div>
                )}
              </CardHeader>
            </Card>

            <div className="space-y-6 mb-8">
              {questions.map((question, questionIndex) => {
                const isAnswered = selectedAnswers[questionIndex] !== -1;
                const isCorrect =
                  selectedAnswers[questionIndex] === question.correct;

                return (
                  <Card
                    key={questionIndex}
                    className={`${isAnswered ? "border-2" : "border"} ${
                      showAnswers
                        ? isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : isAnswered
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300"
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold">
                            Câu {questionIndex + 1}
                          </h3>
                          {isAnswered && !showAnswers && (
                            <span className="text-sm text-indigo-600 font-medium">
                              ✓ Đã trả lời
                            </span>
                          )}
                          {showAnswers && (
                            <span
                              className={`text-sm font-medium ${
                                isCorrect ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isCorrect ? "✓ Đúng" : "✗ Sai"}
                            </span>
                          )}
                          {showAnswers && !isAnswered && (
                            <span className="text-sm text-gray-500 font-medium">
                              Chưa trả lời
                            </span>
                          )}
                        </div>
                        <p className="text-lg">{question.question}</p>
                      </div>

                      <RadioGroup
                        value={selectedAnswers[questionIndex]?.toString() || ""}
                        onValueChange={(value) =>
                          handleAnswerSelect(parseInt(value), questionIndex)
                        }
                        disabled={showAnswers}
                      >
                        {question.option.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-2 mb-3"
                          >
                            <RadioGroupItem
                              value={optionIndex.toString()}
                              id={`question-${questionIndex}-option-${optionIndex}`}
                            />
                            <Label
                              htmlFor={`question-${questionIndex}-option-${optionIndex}`}
                              className={`text-lg cursor-pointer ${
                                showAnswers && optionIndex === question.correct
                                  ? "text-green-600 font-bold"
                                  : showAnswers &&
                                    optionIndex ===
                                      selectedAnswers[questionIndex] &&
                                    optionIndex !== question.correct
                                  ? "text-red-600 font-bold"
                                  : ""
                              }`}
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      {showAnswers && (
                        <div className="mt-4 p-4 rounded-lg bg-gray-100">
                          {isAnswered ? (
                            <>
                              <div
                                className={`font-semibold ${
                                  isCorrect ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {isCorrect ? "✓ Đúng!" : "✗ Sai!"}
                              </div>
                              <div className="mt-2">
                                <strong>Đáp án đúng:</strong>{" "}
                                {question.option[question.correct]}
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-600">
                              <strong>Bạn chưa trả lời câu này</strong>
                              <div className="mt-2">
                                <strong>Đáp án đúng:</strong>{" "}
                                {question.option[question.correct]}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 mb-8">
              {!showAnswers ? (
                <Button
                  size="lg"
                  onClick={submitQuiz}
                  className="px-8 py-3 text-lg"
                >
                  Nộp bài
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={resetQuiz}
                  className="px-8 py-3 text-lg"
                >
                  Làm bài mới
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={resetQuiz}
                className="px-8 py-3 text-lg"
              >
                Quay lại trang chủ
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}
