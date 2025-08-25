"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, Award, BarChart2, Activity, Eye, Accessibility } from 'lucide-react';
import { Header } from '@/components/Header';
import { useEffect, useRef, useState, } from 'react';
import React from 'react';
export default function HomePage() {
  const sections = [
    { id: 'inicio', label: 'Início' },
    { id: 'caracteristicas', label: 'Características' },
    { id: 'depoimentos', label: 'Depoimentos' },
    { id: 'como-funciona', label: 'Como Funciona' },
    { id: 'faq', label: 'FAQ' },
    { id: 'parceiros', label: 'Parceiros' },
    { id: 'blog', label: 'Blog' },
  ];
  const [activeSection, setActiveSection] = useState('inicio');
  const sectionRefs = useRef(sections.map(() => React.createRef<HTMLDivElement>()));

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offsets = sectionRefs.current.map(ref => ref.current?.offsetTop ?? 0);
      const heights = sectionRefs.current.map(ref => ref.current?.offsetHeight ?? 0);
      const index = offsets.findIndex((offset, i) => scrollY + window.innerHeight / 2 < offset + heights[i]);
      setActiveSection(sections[index === -1 ? sections.length - 1 : index].id);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    const ref = sectionRefs.current[sections.findIndex(s => s.id === id)];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [headerTransparent, setHeaderTransparent] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setHeaderTransparent(window.scrollY < 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
  <main className="w-full bg-zinc-50 dark:bg-zinc-900">
      <Header
        exibirNavbar
        navItems={sections.map(s => ({ href: `#${s.id}`, label: s.label }))}
        menuItemClassName="text-zinc-200 hover:text-zinc-300"
        className={`sticky top-0 left-0 w-full z-50 transition-colors duration-300 ${headerTransparent ? 'bg-zinc-900/95 backdrop-blur shadow' : 'bg-zinc-900/80 backdrop-blur shadow'}`}
      />

  
  <section
    id="inicio"
    ref={sectionRefs.current[0]}
    className="w-full min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden animate-fadeIn bg-zinc-100 dark:bg-zinc-900"
  >

      <div className="flex justify-center mb-6 gap-6 relative z-10">
        <Award className="w-10 h-10 text-[#991818] drop-shadow-lg animate-bounce" style={{animationDelay:'0s'}} /> 
        <User className="w-10 h-10 text-[#19274e] drop-shadow-lg animate-bounce" style={{animationDelay:'0.2s'}} /> 
        <BarChart2 className="w-10 h-10 text-[#185b63] drop-shadow-lg animate-bounce" style={{animationDelay:'0.4s'}} /> 
        <Activity className="w-10 h-10 text-[#feae4b] drop-shadow-lg animate-bounce" style={{animationDelay:'0.6s'}} />
        <Eye className="w-10 h-10 text-[#38bdf8] drop-shadow-lg animate-bounce" style={{animationDelay:'0.8s'}} /> 
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight relative z-10">Simulador de Carreira<br />para o Ensino Médio</h1>
      <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 mb-4 relative z-10">Escolha seu futuro com autonomia, clareza e confiança.</p>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 relative z-10">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#38bdf8]/10 text-[#252525] dark:text-zinc-100 font-medium text-sm shadow">+ Teste de Perfil</span>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#818cf8]/10 text-[#252525] dark:text-zinc-100 font-medium text-sm shadow">+ Recomendações Profissionais</span>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#252525]/10 text-[#252525] dark:text-zinc-100 font-medium text-sm shadow">+ Depoimentos Reais</span>
      </div>
      <div className="max-w-xl mx-auto mb-8 relative z-10">
        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">Descubra suas habilidades, compare carreiras, receba dicas e tome decisões com mais segurança. O RotaFuturo é feito para você que quer autonomia e clareza na escolha profissional.</p>
      </div>
      <Link href="/auth" className="relative z-10">
        <Button size="lg" className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-8 py-4 text-lg shadow-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition">Acessar Simulador</Button>
      </Link>
    
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
          100% { transform: translateY(0); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </section>

    
      
      <section
        id="caracteristicas"
        ref={sectionRefs.current[1]}
  className="w-full min-h-screen flex items-center justify-center px-4 animate-slideUp bg-zinc-100 dark:bg-zinc-900"
      >
        <div className="w-full">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center">Características</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  p-8 flex flex-col items-center transition hover:scale-105">
                <Activity className="w-10 h-10 mb-4 text-[#feae4b]" /> 
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Autoconhecimento</span>
              <p className="text-zinc-900 dark:text-zinc-50 text-center">Identifique preferências, habilidades e interesses por meio de questionários e mapeamento de áreas de conhecimento.</p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  p-8 flex flex-col items-center transition hover:scale-105">
                <BarChart2 className="w-10 h-10 mb-4 text-[#185b63]" /> 
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Sugestão de Carreiras</span>
              <p className="text-zinc-900 dark:text-zinc-50 text-center">Receba recomendações de profissões alinhadas ao seu perfil, com informações detalhadas sobre mercado e perspectivas.</p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  p-8 flex flex-col items-center transition hover:scale-105">
                <Award className="w-10 h-10 mb-4 text-[#991818]" /> 
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Engajamento</span>
              <p className="text-zinc-900 dark:text-zinc-50 text-center">Gamificação, notificações e rankings internos para incentivar seu desenvolvimento contínuo.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  p-8 flex flex-col items-center transition hover:scale-105">
                <Eye className="w-10 h-10 mb-4 text-[#38bdf8]" /> 
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Realidade Profissional</span>
              <p className="text-zinc-900 dark:text-zinc-50 text-center">Depoimentos e dados reais para aproximar você do mercado de trabalho.</p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  p-8 flex flex-col items-center transition hover:scale-105">
                <Accessibility className="w-10 h-10 mb-4 text-[#665e52]" /> 
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Acessibilidade</span>
              <p className="text-zinc-900 dark:text-zinc-50 text-center">Use o sistema em diferentes dispositivos e ambientes escolares, com máxima usabilidade.</p>
            </div>
          </div>
        </div>
      </section>


    
  <section id="depoimentos" ref={sectionRefs.current[2]} className="w-full py-20 bg-zinc-100 dark:bg-zinc-900">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-10 text-center">Depoimentos de Alunos</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border p-6 flex flex-col justify-between h-56 transition hover:scale-105">
                <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 text-center">"O simulador me ajudou a entender melhor minhas opções e escolher uma carreira que faz sentido pra mim."</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-50 mt-auto text-center">Lucas, 17 anos</span>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border p-6 flex flex-col justify-between h-56 transition hover:scale-105">
                <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 text-center">"Gostei dos testes e das recomendações, agora estou mais confiante para decidir meu futuro."</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-50 mt-auto text-center">Ana, 16 anos</span>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border p-6 flex flex-col justify-between h-56 transition hover:scale-105">
                <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 text-center">"O sistema é fácil de usar e as informações são claras. Recomendo para todos meus colegas!"</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-50 mt-auto text-center">Rafael, 18 anos</span>
              </div>
            </div>
          </div>
        </section>

  
  <section id="como-funciona" ref={sectionRefs.current[3]} className="w-full py-20 bg-zinc-100 dark:bg-zinc-900">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-10 text-center">Como Funciona</h2>
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
              <div className="absolute hidden md:block top-1/2 left-12 right-12 h-1 bg-zinc-300 dark:bg-zinc-700" style={{zIndex:0}} />
              <div className="relative z-10 flex flex-col md:flex-row w-full justify-center items-center">
                
                {[
                  {
                    icon: '📝',
                    title: 'Cadastro',
                    desc: 'Crie sua conta e acesse o simulador.',
                  },
                  {
                    icon: '🔍',
                    title: 'Teste de Perfil',
                    desc: 'Responda perguntas para identificar seus interesses e habilidades.',
                  },
                  {
                    icon: '💡',
                    title: 'Recomendações',
                    desc: 'Receba sugestões de carreiras alinhadas ao seu perfil.',
                  },
                  {
                    icon: '🚀',
                    title: 'Decisão',
                    desc: 'Explore as opções e escolha seu caminho profissional.',
                  },
                ].map((step, idx) => (
                  <React.Fragment key={step.title}>
                    <div
                      className={`group flex flex-col items-center justify-start md:w-1/4 px-2 animate-fadeInUp ${activeSection === 'como-funciona' ? 'step-active' : ''}`}
                      style={{ animationDelay: `${idx * 0.1}s`, minHeight: '220px' }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded shadow mb-2">{idx + 1}</span>
                        <div className={`flex items-center justify-center w-16 h-16 rounded-full text-4xl font-bold shadow-lg border-4 relative transition-all duration-300
                          ${activeSection === 'como-funciona' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-300 dark:border-zinc-700 ring-4 ring-[#38bdf8] ring-opacity-60 scale-110' : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-100 dark:border-zinc-900'}
                          group-hover:scale-110`}
                        >
                          {step.icon}
                        </div>
                      </div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-50 mb-2 text-lg mt-4">{step.title}</span>
                      <span className="text-zinc-700 dark:text-zinc-300 text-center">{step.desc}</span>
                    </div>
                    {idx < 3 && <div className="hidden md:flex flex-1 h-1 bg-zinc-300 dark:bg-zinc-700 mx-2" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(40px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeInUp {
                animation: fadeInUp 0.7s cubic-bezier(.23,1,.32,1) both;
              }
              .step-active .rounded-full {
                box-shadow: 0 0 0 6px #252525ff, 0 4px 24px rgba(0, 0, 0, 0.15);
              }
              .group { min-height: 220px; }
              .group .rounded-full { margin-bottom: 0; }
            `}</style>
          </div>
        </section>

    
  <section id="faq" ref={sectionRefs.current[4]} className="w-full py-20 bg-zinc-100 dark:bg-zinc-900">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-10 text-center">Perguntas Frequentes</h2>
            <div className="space-y-6">
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  p-6 flex flex-col transition hover:scale-105">
          <span className="font-bold text-zinc-900 dark:text-zinc-50">O simulador é gratuito?</span>
        <p className="text-zinc-900 dark:text-zinc-50 mt-2">Sim! O acesso ao simulador é totalmente gratuito para estudantes do ensino médio.</p>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  p-6 flex flex-col transition hover:scale-105">
                <span className="font-bold text-zinc-900 dark:text-zinc-50">Minhas informações são protegidas?</span>
                <p className="text-zinc-900 dark:text-zinc-50 mt-2">Sim, seguimos todas as normas de privacidade e LGPD. Seus dados são usados apenas para personalizar sua experiência.</p>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  p-6 flex flex-col transition hover:scale-105">
                <span className="font-bold text-zinc-900 dark:text-zinc-50">Posso usar o simulador em qualquer dispositivo?</span>
                <p className="text-zinc-900 dark:text-zinc-50 mt-2">Sim, o sistema é responsivo e funciona em celulares, tablets e computadores.</p>
              </div>
            </div>
          </div>
        </section>


  <section id="parceiros" ref={sectionRefs.current[5]} className="w-full py-20 bg-zinc-100 dark:bg-zinc-900">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-10 text-center">Parceiros e Apoio</h2>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  flex items-center justify-center w-40 h-24 text-zinc-900 dark:text-zinc-50 font-bold transition hover:scale-105">Escola A</div>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  flex items-center justify-center w-40 h-24 text-zinc-900 dark:text-zinc-50 font-bold transition hover:scale-105">ONG Futuro</div>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  flex items-center justify-center w-40 h-24 text-zinc-900 dark:text-zinc-50 font-bold transition hover:scale-105">Empresa X</div>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl border  flex items-center justify-center w-40 h-24 text-zinc-900 dark:text-zinc-50 font-bold transition hover:scale-105">Universidade Y</div>
            </div>
          </div>
        </section>

        

    
  <section id="blog" ref={sectionRefs.current[6]} className="w-full py-20 bg-zinc-100 dark:bg-zinc-900">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center tracking-wide uppercase border-b-2 border-zinc-200 dark:border-zinc-700 pb-2">Blog</h2>
            <div className="grid md:grid-cols-3 gap-8">

              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-0 flex flex-col transition hover:scale-[1.03] hover:shadow-2xl overflow-hidden min-h-[340px]">
                <div className="bg-zinc-900 dark:bg-zinc-100 px-6 py-3">
                  <span className="font-bold text-base md:text-lg text-white dark:text-zinc-900 tracking-wide uppercase">Como escolher uma carreira?</span>
                </div>
                <div className="px-6 py-4 flex-1 flex flex-col justify-between">
                  <span className="text-zinc-700 dark:text-zinc-300 mb-3 text-sm md:text-base font-normal leading-relaxed">Dicas práticas para tomar decisões profissionais com mais segurança.</span>
                  <div className="flex justify-end items-end w-full mt-2">
                    <a href="#" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#252525] dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow hover:bg-[#444] dark:hover:bg-zinc-300 transition-all duration-200 text-xs tracking-wide">Ler artigo <svg xmlns='http://www.w3.org/2000/svg' className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' /></svg></a>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-0 flex flex-col transition hover:scale-[1.03] hover:shadow-2xl overflow-hidden min-h-[340px]">
                <div className="bg-zinc-900 dark:bg-zinc-100 px-6 py-3">
                  <span className="font-bold text-base md:text-lg text-white dark:text-zinc-900 tracking-wide uppercase">Mercado de trabalho em alta</span>
                </div>
                <div className="px-6 py-4 flex-1 flex flex-col justify-between">
                  <span className="text-zinc-700 dark:text-zinc-300 mb-3 text-sm md:text-base font-normal leading-relaxed">Veja as áreas que mais crescem e como se preparar para elas.</span>
                  <div className="flex justify-end items-end w-full mt-2">
                    <a href="#" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#252525] dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow hover:bg-[#444] dark:hover:bg-zinc-300 transition-all duration-200 text-xs tracking-wide">Ler artigo <svg xmlns='http://www.w3.org/2000/svg' className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' /></svg></a>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-0 flex flex-col transition hover:scale-[1.03] hover:shadow-2xl overflow-hidden min-h-[340px]">
                <div className="bg-zinc-900 dark:bg-zinc-100 px-6 py-3">
                  <span className="font-bold text-base md:text-lg text-white dark:text-zinc-900 tracking-wide uppercase">Erros comuns na escolha profissional</span>
                </div>
                <div className="px-6 py-4 flex-1 flex flex-col justify-between">
                  <span className="text-zinc-700 dark:text-zinc-300 mb-3 text-sm md:text-base font-normal leading-relaxed">Saiba como evitar armadilhas e fazer uma escolha mais consciente.</span>
                  <div className="flex justify-end items-end w-full mt-2">
                    <a href="#" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#252525] dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow hover:bg-[#444] dark:hover:bg-zinc-300 transition-all duration-200 text-xs tracking-wide">Ler artigo <svg xmlns='http://www.w3.org/2000/svg' className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' /></svg></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      
      <footer className="w-full py-8 text-center text-zinc-500 text-sm">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">© {new Date().getFullYear()} RotaFuturo</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Todos os direitos reservados.</span>
          <div className="flex gap-4 mt-2">
            <a href="https://www.instagram.com/rotafuturo" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2"/><circle cx="12" cy="12" r="4" strokeWidth="2"/><circle cx="17" cy="7" r="1" /></svg>
            </a>
            <a href="mailto:contato@rotafuturo.com" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="7" width="18" height="10" rx="2" strokeWidth="2"/><polyline points="3 7 12 13 21 7" strokeWidth="2"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

