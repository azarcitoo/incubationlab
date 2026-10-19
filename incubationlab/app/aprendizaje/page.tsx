"use client";

import { useState } from "react";
import EducationalPage from "../components/EducationalPage";
import { quizQuestions } from "../data/quiz";

export default function LearningPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = quizQuestions[questionIndex];
  const completed = questionIndex === quizQuestions.length;

  const submitAnswer = (option: number) => {
    if (answer !== null) return;
    setAnswer(option);
    if (option === question.answer) setScore((current) => current + 1);
  };

  const nextQuestion = () => {
    setQuestionIndex((current) => current + 1);
    setAnswer(null);
  };

  const restart = () => {
    setQuestionIndex(0);
    setAnswer(null);
    setScore(0);
  };

  return (
    <EducationalPage
      eyebrow="Aprendizaje activo · 8 preguntas"
      title="Cuestionario"
      description="Comprueba conceptos básicos de incubación y aprende a distinguir una referencia educativa de una afirmación diagnóstica."
    >
      <section className="card feature-card quiz-card" aria-live="polite">
        {completed ? (
          <div className="quiz-complete">
            <span className="section-kicker">Recorrido completado</span>
            <h2>Resultado: {score} de {quizQuestions.length}</h2>
            <p>Las respuestas incluyen fuentes para que puedas seguir explorando los temas.</p>
            <button className="feature-button" type="button" onClick={restart}>Volver a empezar</button>
          </div>
        ) : (
          <>
            <div className="quiz-progress">
              <span className="section-kicker">Pregunta {questionIndex + 1} de {quizQuestions.length}</span>
              <span>Respuestas correctas: {score}</span>
            </div>
            <h2>{question.question}</h2>
            <div className="quiz-options">
              {question.options.map((option, index) => {
                const isCorrectAnswer = index === question.answer;
                const isChosen = answer === index;
                const stateClass = answer === null
                  ? ""
                  : isCorrectAnswer
                    ? " is-correct"
                    : isChosen
                      ? " is-incorrect"
                      : "";
                return (
                  <button
                    key={option}
                    className={`quiz-option${stateClass}`}
                    type="button"
                    disabled={answer !== null}
                    aria-pressed={isChosen}
                    onClick={() => submitAnswer(index)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {answer !== null && (
              <div className="quiz-feedback">
                <p><strong>{answer === question.answer ? "Correcto." : "No es la respuesta correcta."}</strong> {question.explanation}</p>
                <p className="feature-note">Fuente: {question.source}</p>
                <button className="feature-button" type="button" onClick={nextQuestion}>
                  {questionIndex === quizQuestions.length - 1 ? "Ver resultado" : "Siguiente pregunta"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </EducationalPage>
  );
}
