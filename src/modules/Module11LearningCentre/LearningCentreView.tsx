import React, { useState } from 'react';
import { learningLessons, quizQuestions } from '../../data/mockData';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Award,
  Layers,
  ArrowRight,
  Droplet,
  Filter,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const LearningCentreView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'quiz' | 'glossary'>('lessons');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(learningLessons[0].id);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const activeLesson = learningLessons.find(l => l.id === selectedLessonId) || learningLessons[0];

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const glossaryItems = [
    { term: 'AC Condensate', definition: 'Liquid water produced when warm moist ambient air cools below its dew point across an air conditioning evaporator coil.' },
    { term: 'Lamella Clarifier', definition: 'A series of inclined plates used in wastewater treatment that multiply effective settling area, accelerating particle sedimentation.' },
    { term: 'Turbidity (NTU)', definition: 'Nephelometric Turbidity Units: optical measurement of water cloudiness caused by microscopic suspended colloids that scatter light.' },
    { term: 'Granular Activated Carbon (GAC)', definition: 'High-porosity carbonaceous adsorbent with surface area exceeding 1,000 m²/g, binding organic chemicals, surfactants, and odors.' },
    { term: 'UV-C Photolysis (254nm)', definition: 'Short-wavelength ultraviolet germicidal irradiation that damages bacterial and viral DNA, preventing replication without chemical addition.' },
    { term: 'ESP32 Microcontroller', definition: 'A low-cost, low-power dual-core 32-bit system-on-a-chip microcontroller with integrated Wi-Fi and Bluetooth, ideal for IoT edge telemetry.' },
    { term: 'Electrical Conductivity (EC)', definition: 'A quantitative indicator of dissolved mineral ions and salts in water, measured in microSiemens per centimeter (µS/cm).' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#123B55]">
            <GraduationCap className="w-7 h-7 text-[#123B55]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#123B55]">AquaTech Science & Learning Centre</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-[#123B55] font-bold border border-blue-200">
                Educational Exhibition
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive Scientific Explanations, Psychrometric Principles, Multi-Barrier Separation & Knowledge Quizzes
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'lessons' ? 'bg-white text-[#123B55] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Science Modules
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'quiz' ? 'bg-white text-[#123B55] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Interactive Quiz ({quizQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'glossary' ? 'bg-white text-[#123B55] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Scientific Glossary
          </button>
        </div>
      </div>

      {/* Tab: Science Modules */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Lessons List Sidebar */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block px-1">
              Curriculum Topics
            </span>
            {learningLessons.map((lesson) => {
              const isSelected = lesson.id === selectedLessonId;
              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all text-left ${
                    isSelected
                      ? 'bg-[#123B55] text-white border-[#123B55] shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span className={isSelected ? 'text-[#5CB6DC]' : 'text-slate-400'}>{lesson.category}</span>
                    <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>{lesson.readTime} read</span>
                  </div>
                  <h4 className="font-bold text-xs leading-snug">{lesson.title}</h4>
                  <p className={`text-[11px] mt-1.5 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {lesson.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Lesson Content Viewer */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#21A6A0] font-bold uppercase block">
                  {activeLesson.category}
                </span>
                <h3 className="text-lg font-bold text-[#123B55] mt-0.5">{activeLesson.title}</h3>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
                {activeLesson.readTime}
              </span>
            </div>

            {/* Markdown/Formatted text */}
            <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-3 text-slate-700">
              <div className="whitespace-pre-line font-sans">{activeLesson.content}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Interactive Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#123B55] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#21A6A0]" />
                AquaTech Engineering Knowledge Check
              </h3>
              <p className="text-xs text-slate-500">Test your understanding of condensate recovery, wastewater filtration & safety rules.</p>
            </div>
            {showResults && (
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1 text-xs text-[#21A6A0] font-semibold hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            )}
          </div>

          {/* Score Banner when results shown */}
          {showResults && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-lg">
                  {calculateScore()} / {quizQuestions.length}
                </div>
                <div>
                  <h4 className="font-bold text-sm">Knowledge Assessment Completed!</h4>
                  <p className="text-xs text-emerald-700">
                    {calculateScore() === quizQuestions.length ? 'Perfect Score! You have mastered the engineering principles.' : 'Good attempt! Review the explanations below.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {quizQuestions.map((q, idx) => {
              const userAnswer = selectedAnswers[q.id];
              const isAnswered = userAnswer !== undefined;
              const isCorrect = isAnswered && userAnswer === q.correctIndex;

              return (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold text-slate-900 text-sm">
                      {idx + 1}. {q.question}
                    </span>
                    {showResults && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (showResults) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-100 border-rose-300 text-rose-900 line-through';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-[#123B55] text-white border-[#123B55] font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={showResults}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-center gap-2.5 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-[10px] flex-shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 text-[11px] leading-relaxed">
                      <strong>Scientific Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!showResults && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                className="bg-[#21A6A0] hover:bg-[#1b8c87] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition shadow-xs"
              >
                Submit Answers & Verify Score
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Glossary */}
      {activeTab === 'glossary' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-bold text-[#123B55] text-sm">AquaTech Scientific & Technical Glossary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {glossaryItems.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-[#123B55] block text-sm">{item.term}</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

