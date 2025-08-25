'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';

type ViewType = 'home' | 'login' | 'register';

interface Slide {
  id: number;
  title: string;
  content: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'O futuro não começa no vestibular, começa no ensino médio.',
    content:
      'O RotaFuturo é um sistema interativo que ajuda alunos a descobrirem suas habilidades, explorarem carreiras e traçarem a trilha certa para seus sonhos.',
  },
  {
    id: 2,
    title: 'Sobre o Projeto',
    content:
      'O RotaFuturo foi criado para transformar a orientação profissional em uma experiência prática, acessível e envolvente. Através de questionários inteligentes, trilhas personalizadas e informações reais do mercado de trabalho, cada aluno encontra o caminho mais alinhado ao seu perfil e às suas habilidades.',
  },
  {
    id: 3,
    title: 'Benefício ao Estudante',
    content:
      'Mais clareza. Mais motivação. Mais chances de sucesso. O RotaFuturo guia o aluno em cada etapa da descoberta profissional.',
  },
  {
    id: 4,
    title: 'Encerramento',
    content:
      'Escolher uma carreira não precisa ser confuso. Com o RotaFuturo, cada aluno encontra sua direção, constrói sua jornada e escreve a própria história.',
  },
];

export default function Home() {
  const { logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleBack = () => {
    setCurrentView('home');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
  };

  const renderRightContent = () => {
    if (currentView === 'login') {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <LoginForm onBack={handleBack} />
        </div>
      );
    }
    if (currentView === 'register') {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <RegisterForm onBack={handleBack} />
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-wider mb-6 bg-zinc-900 bg-clip-text text-transparent dark:bg-zinc-100 dark:bg-clip-text dark:text-transparent">
            <div>ROTAFUTURO</div>
          </h1>
          <p className="text-zinc-900 dark:text-zinc-100 text-lg">
            De estudante a protagonista da própria carreira.
          </p>
        </div>
        <div className="flex gap-4 justify-end mt-auto">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setCurrentView('login')}
            className="bg-transparent border-none shadow-none hover:bg-transparent text-zinc-800 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Entrar
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentView('register')}
            className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Cadastre-se
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header
        exibirNavbar={false}
        exibirBarraPesquisa={false}
        exibirPerfil={true}
        className="bg-zinc-900/95 backdrop-blur shadow dark:bg-zinc-900/95"
        extra={
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm">
            <a
              href="/"
              className="inline-flex items-center gap-1 text-zinc-200 hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Home
            </a>
            <span className="text-zinc-200">/</span>
            <span className="text-zinc-200 font-semibold">Autenticação</span>
          </nav>
        }
      />
      <div className="container mx-auto px-4 py-12">
        <div className="flex h-[500px] shadow-soft hover:shadow-glow bg-zinc-300 dark:bg-zinc-900 rounded-3xl border-2 border-zinc-400 dark:border-zinc-800 overflow-hidden">
          <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center rounded-2xl relative overflow-hidden">
            <div className="text-justify text-zinc-600 dark:text-zinc-300 px-8 max-w-md transition-all duration-500 ease-in-out">
              <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100 leading-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg leading-relaxed">{slides[currentSlide].content}</p>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-200" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-zinc-600 dark:text-zinc-200" />
            </button>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-zinc-600 dark:bg-zinc-200 scale-125'
                      : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-6 right-6 bg-white/80 dark:bg-zinc-800/80 px-3 py-1 rounded-full text-sm font-medium text-zinc-600 dark:text-zinc-200">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>

          <div className="w-2/5 bg-transparent dark:bg-zinc-900/80 p-8 flex items-center justify-center transition-all duration-300">
            <div className="w-full h-full">{renderRightContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
