'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/app/auth/components/LoginForm';
import { RegisterForm } from '@/app/auth/components/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { ChevronLeft, ChevronRight, Award, BarChart2, Activity, Eye } from 'lucide-react';
import { Header } from '@/components/Header';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

type ViewType = 'home' | 'login' | 'register';

interface Slide {
  id: number;
  title: string;
  content: string;
  icon?: React.ReactNode;
}

const slides: Slide[] = [
  {
    id: 1,
    icon: <Award className="w-8 h-8 text-[#991818] mb-2" />,
    title: 'Descubra seu potencial desde o Ensino Médio',
    content:
      'O RotaFuturo te ajuda a entender suas habilidades, interesses e preferências para tomar decisões profissionais com mais autonomia e clareza.',
  },
  {
    id: 2,
    icon: <BarChart2 className="w-8 h-8 text-[#185b63] mb-2" />,
    title: 'Trilhas e recomendações personalizadas',
    content:
      'Receba sugestões de carreiras alinhadas ao seu perfil, com informações reais do mercado e dicas para construir sua trajetória.',
  },
  {
    id: 3,
    icon: <Activity className="w-8 h-8 text-[#feae4b] mb-2" />,
    title: 'Motivação e engajamento contínuo',
    content:
      'Gamificação, notificações e rankings internos para incentivar seu desenvolvimento e tornar a escolha profissional mais leve e divertida.',
  },
  {
    id: 4,
    icon: <Eye className="w-8 h-8 text-[#38bdf8] mb-2" />,
    title: 'Conecte-se com o mundo do trabalho',
    content:
      'Depoimentos reais, dados do mercado e experiências de profissionais para aproximar você da realidade das carreiras.',
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

  const slideRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;
    let startX = 0;
    let endX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      if (startX - endX > 40) nextSlide();
      if (endX - startX > 40) prevSlide();
    };
    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

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
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>Autenticação</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="container mx-auto px-2 py-6">
        <div className="flex flex-col md:flex-row min-h-[600px] md:h-[500px] shadow-soft hover:shadow-glow bg-zinc-300 dark:bg-zinc-900 rounded-3xl border-2 border-zinc-400 dark:border-zinc-800 overflow-hidden">
          <div
            ref={slideRef}
            className="w-full md:flex-1 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center rounded-2xl relative overflow-hidden min-h-[320px] md:min-h-[260px]"
          >
            <div className="text-justify text-zinc-600 dark:text-zinc-300 px-4 md:px-8 max-w-md transition-all duration-500 ease-in-out flex flex-col items-center">
              <div className="flex flex-col items-center justify-center w-full mb-2">
                <span className="flex items-center justify-center w-12 h-12 mb-2">
                  {slides[currentSlide].icon}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-5 text-zinc-800 dark:text-zinc-100 leading-tight text-center w-full">
                {slides[currentSlide].title}
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-center w-full">
                {slides[currentSlide].content}
              </p>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hidden md:block"
            >
              <ChevronLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-200" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hidden md:block"
            >
              <ChevronRight className="w-6 h-6 text-zinc-600 dark:text-zinc-200" />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-zinc-600 dark:bg-zinc-200 scale-125'
                      : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500'
                  }`}
                ></button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-2/5 bg-transparent dark:bg-zinc-900/80 p-4 md:p-8 flex items-center justify-center transition-all duration-300 min-h-[320px] md:min-h-[260px]">
            <div className="w-full h-full">{renderRightContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
