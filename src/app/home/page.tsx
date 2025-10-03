'use client';
import { HeaderHome } from '@/components/HeaderHome';
import Image from 'next/image';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePessoa } from '@/hooks/usePessoa';
import { useAuthContext } from '@/components/context/AuthContext';
import Stepper from '@/components/Stepper';
import { ProfileFormStepper } from './components/ProfileFormStepper';
import { VocationalTestStepper } from '@/components/VocationalTestStepper';
import { VocationalTestResultStepper } from './components/VocationalTestResultStepper';
import { SubareaTestStepper } from '@/components/SubareaTestStepper';
import { SubareaTestResultStepper } from './components/SubareaTestResultStepper';
import { ManualSelectionStepper } from './components/ManualSelectionStepper';
import configService from '@/services/configService';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
// Definindo tipos de dados para os cursos
type Curso = {
  id: string;
  titulo: string;
  emoji: string;
  descricao: string;
  areas: string[];
  imagem: string;
  carreiraInfo?: {
    mercadoTrabalho: string;
    salario: string;
    habilidades: string[];
    trajetoria: {
      fase: string;
      descricao: string;
    }[];
  };
};

// Agrupando cursos por categorias
type CategoriasCursos = {
  [key: string]: Curso[];
};

// Dados dos cursos
const cursos: Curso[] = [
  {
    id: 'agronomia',
    titulo: 'Agronomia',
    emoji: '🌱',
    imagem: '/imagens/cursos/img_agronomia.jpg',
    descricao:
      'Já pensou em fazer parte da transformação do futuro da alimentação e do meio ambiente? O curso de Agronomia vai muito além de plantar e colher: ele forma profissionais que unem ciência, tecnologia e inovação para garantir que o mundo tenha alimentos de qualidade, produzidos de forma sustentável e responsável.',
    areas: [
      'Produção agrícola e pecuária – ajudando a aumentar a produtividade sem agredir a natureza.',
      'Sustentabilidade e meio ambiente – desenvolvendo soluções para preservar os recursos naturais.',
      'Pesquisas e biotecnologia – criando novas sementes, tecnologias e métodos de cultivo.',
      'Gestão e empreendedorismo – liderando fazendas, empresas do agronegócio ou até seu próprio negócio.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O mercado para profissionais de Agronomia está em constante crescimento, impulsionado pela demanda global por alimentos e práticas agrícolas sustentáveis. O Brasil, sendo uma potência agrícola, oferece oportunidades tanto em grandes empresas do agronegócio quanto em consultorias especializadas, órgãos de pesquisa e desenvolvimento de novas tecnologias.',
      salario:
        'A média salarial inicial para um Engenheiro Agrônomo varia entre R$ 4.000 e R$ 7.000, podendo ultrapassar R$ 15.000 para profissionais experientes e especialistas em áreas específicas como agricultura de precisão e biotecnologia.',
      habilidades: [
        'Conhecimento técnico em ciências agrárias',
        'Capacidade analítica para solucionar problemas',
        'Adaptabilidade às mudanças climáticas e tecnológicas',
        'Gestão de recursos e pessoas',
        'Sensibilidade ambiental e visão sustentável',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Trabalho em fazendas, cooperativas ou como assistente técnico, aplicando conhecimentos básicos e ganhando experiência prática no campo.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Especialização em uma área específica como fitotecnia, solos ou irrigação, assumindo responsabilidades técnicas maiores e coordenação de pequenos projetos.',
        },
        {
          fase: 'Pleno Desenvolvimento',
          descricao:
            'Gerenciamento de grandes projetos agrícolas, consultoria especializada ou pesquisa avançada, implementando tecnologias inovadoras e liderando equipes.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Direção técnica em grandes empresas do agronegócio, empreendimento próprio ou atuação como referência em pesquisa e desenvolvimento no setor agrícola.',
        },
      ],
    },
  },
  {
    id: 'biomedicina',
    titulo: 'Biomedicina',
    emoji: '🧬',
    imagem: '/imagens/cursos/img_biomedicina.jpg',
    descricao:
      'Já imaginou estar na linha de frente das descobertas científicas que salvam vidas? A Biomedicina é um curso para quem gosta de ciência, laboratório e quer fazer parte da busca por respostas que transformam a saúde do mundo.',
    areas: [
      'Análises clínicas – realizando exames que ajudam a diagnosticar e tratar doenças.',
      'Pesquisa científica – desenvolvendo vacinas, medicamentos e novas tecnologias.',
      'Biotecnologia e genética – explorando o DNA e criando soluções inovadoras para o futuro da medicina.',
      'Estética e saúde – aplicando recursos modernos para cuidar da beleza e do bem-estar.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O biomédico encontra um mercado de trabalho diversificado e em expansão, especialmente nas áreas de diagnóstico laboratorial, pesquisa científica e desenvolvimento de novas tecnologias em saúde. Com o avanço da medicina personalizada e diagnósticos moleculares, surgem constantemente novas oportunidades em hospitais, laboratórios, indústria farmacêutica e centros de pesquisa.',
      salario:
        'O salário inicial de um biomédico gira em torno de R$ 3.500 a R$ 5.500, podendo chegar a R$ 12.000 ou mais em cargos de gestão ou com especializações em áreas de alta demanda como genética molecular e imunologia.',
      habilidades: [
        'Precisão e atenção aos detalhes',
        'Raciocínio analítico e científico',
        'Conhecimento técnico em procedimentos laboratoriais',
        'Atualização constante com novas tecnologias',
        'Capacidade de trabalho em equipe multidisciplinar',
      ],
      trajetoria: [
        {
          fase: 'Iniciante',
          descricao:
            'Atuação como analista em laboratórios clínicos ou auxiliar de pesquisa, realizando exames e procedimentos básicos sob supervisão.',
        },
        {
          fase: 'Em Desenvolvimento',
          descricao:
            'Especialização em uma área específica como análises clínicas, imagenologia ou citologia, assumindo maior autonomia técnica.',
        },
        {
          fase: 'Experiente',
          descricao:
            'Coordenação de setores em laboratórios, participação em pesquisas científicas importantes ou docência em instituições de ensino.',
        },
        {
          fase: 'Sênior',
          descricao:
            'Gestão de laboratórios, liderança em projetos de pesquisa inovadores, consultoria especializada ou empreendimento na área de saúde e diagnóstico.',
        },
      ],
    },
  },
  {
    id: 'enfermagem',
    titulo: 'Enfermagem',
    emoji: '💉',
    imagem: '/imagens/cursos/img_enfermagem.jpg',
    descricao:
      'Ser enfermeiro é estar presente nos momentos mais importantes da vida das pessoas. É cuidar, acolher e salvar vidas todos os dias, unindo técnica, empatia e dedicação.',
    areas: [
      'Hospitais e clínicas – prestando cuidados diretos a pacientes.',
      'Saúde pública – trabalhando em campanhas de prevenção e vacinação.',
      'UTI e emergência – atuando em situações críticas e salvando vidas.',
      'Gestão em saúde – liderando equipes e coordenando serviços hospitalares.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'A Enfermagem possui um dos mercados mais estáveis e com constante demanda na área de saúde. Profissionais qualificados são requisitados em hospitais, clínicas, home care, empresas, escolas e unidades de saúde pública. Com o envelhecimento da população e avanços da medicina, novas especialidades e campos de atuação surgem continuamente.',
      salario:
        'O salário inicial de um enfermeiro varia entre R$ 3.000 e R$ 5.000, podendo alcançar valores entre R$ 8.000 e R$ 15.000 em cargos de coordenação, com especializações em áreas como UTI, centro cirúrgico ou oncologia.',
      habilidades: [
        'Conhecimento técnico-científico em procedimentos de saúde',
        'Empatia e humanização no cuidado',
        'Capacidade de tomada de decisão rápida',
        'Trabalho em equipe multidisciplinar',
        'Resiliência emocional e física',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Trabalho em enfermarias gerais, pronto atendimento ou postos de saúde, desenvolvendo habilidades básicas e compreendendo a rotina de cuidados.',
        },
        {
          fase: 'Desenvolvimento Profissional',
          descricao:
            'Especialização em uma área específica como UTI, obstetrícia, oncologia ou pediatria, ganhando expertise e autonomia em procedimentos específicos.',
        },
        {
          fase: 'Carreira Consolidada',
          descricao:
            'Liderança de equipes de enfermagem, supervisão de setores hospitalares ou atuação como enfermeiro de referência em procedimentos complexos.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Gestão de serviços de saúde, coordenação de departamentos de enfermagem, consultoria especializada ou docência em instituições de ensino superior.',
        },
      ],
    },
  },
  {
    id: 'engenhariaMecanica',
    titulo: 'Engenharia Mecânica',
    emoji: '⚙️',
    imagem: '/imagens/cursos/img_engMecanica.jpg',
    descricao:
      'Se você gosta de máquinas, cálculos e inovação, a Engenharia Mecânica pode ser sua porta de entrada para criar o futuro. Essa área projeta, desenvolve e melhora sistemas que movimentam indústrias e transformam o mundo.',
    areas: [
      'Indústria automotiva e aeronáutica – desenvolvendo veículos e tecnologias de transporte.',
      'Robótica e automação – criando máquinas inteligentes e sistemas automatizados.',
      'Energia e sustentabilidade – buscando soluções para geração e uso eficiente de energia.',
      'Projetos industriais – planejando e otimizando processos produtivos.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O engenheiro mecânico possui amplo mercado de trabalho em diversos setores industriais, desde a produção automotiva até a indústria de energia. Com a atual transição energética e o desenvolvimento da indústria 4.0, profissionais que dominam automação, robótica e sustentabilidade encontram excelentes oportunidades em grandes empresas e também como consultores.',
      salario:
        'Os salários iniciais variam entre R$ 4.500 e R$ 7.000, podendo chegar a R$ 15.000 ou mais em posições gerenciais ou com especialização em áreas de alta demanda como projetos especiais, automação industrial e eficiência energética.',
      habilidades: [
        'Conhecimento técnico em mecânica e física aplicada',
        'Raciocínio lógico e matemático',
        'Capacidade de projetar e desenvolver soluções',
        'Visão espacial e criatividade técnica',
        'Conhecimento de softwares de simulação e modelagem',
      ],
      trajetoria: [
        {
          fase: 'Início da Carreira',
          descricao:
            'Atuação como engenheiro júnior em indústrias, auxiliando em projetos e manutenção, aprendendo a aplicar os conhecimentos teóricos em situações práticas.',
        },
        {
          fase: 'Desenvolvimento',
          descricao:
            'Especialização em uma área específica como projetos, manutenção industrial ou automação, assumindo responsabilidade por projetos de médio porte.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Coordenação de equipes técnicas, gerenciamento de grandes projetos ou consultoria especializada, implementando soluções complexas em empresas.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Gestão de departamentos de engenharia, direção técnica em grandes empresas, consultoria estratégica ou empreendimento próprio na área de desenvolvimento tecnológico.',
        },
      ],
    },
  },
  {
    id: 'fonoaudiologia',
    titulo: 'Fonoaudiologia',
    emoji: '🗣️',
    imagem: '/imagens/cursos/img_Fonoaudiologia.jpg',
    descricao:
      'Comunicar é viver! A Fonoaudiologia forma profissionais que cuidam da fala, da voz, da audição e até da deglutição, ajudando pessoas a se expressarem e recuperarem sua qualidade de vida.',
    areas: [
      'Clínicas e hospitais – reabilitando pacientes com dificuldades de fala e audição.',
      'Escolas – auxiliando no desenvolvimento da comunicação de crianças.',
      'Saúde ocupacional – cuidando da voz de profissionais como professores e cantores.',
      'Estética vocal – aprimorando a performance de quem depende da voz.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'A Fonoaudiologia tem expandido sua presença no mercado além das tradicionais clínicas de reabilitação. Hoje, fonoaudiólogos são requisitados em hospitais, escolas, empresas de comunicação, companhias de teatro e música, além de atenderem a uma crescente demanda na área de saúde ocupacional e corporativa, cuidando da saúde vocal de profissionais que usam a voz como instrumento de trabalho.',
      salario:
        'Os salários iniciais na fonoaudiologia variam entre R$ 3.000 e R$ 5.000, podendo alcançar R$ 10.000 ou mais para profissionais especializados em áreas como disfagia, voz profissional ou audiologia, especialmente em consultórios privados bem estabelecidos.',
      habilidades: [
        'Escuta atenta e sensibilidade para diagnósticos',
        'Comunicação clara e empática',
        'Paciência e persistência no tratamento',
        'Capacidade de adaptação a diferentes casos',
        'Criatividade para desenvolver exercícios e terapias personalizadas',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Atuação em clínicas multiprofissionais, hospitais ou escolas, adquirindo experiência prática nos diferentes tipos de distúrbios da comunicação.',
        },
        {
          fase: 'Especialização',
          descricao:
            'Aprofundamento em uma área específica como voz, linguagem, motricidade orofacial ou audiologia, desenvolvendo expertise técnica e métodos terapêuticos.',
        },
        {
          fase: 'Consolidação Profissional',
          descricao:
            'Estabelecimento de consultório próprio, atuação como especialista em equipes multidisciplinares ou desenvolvimento de programas de saúde vocal em organizações.',
        },
        {
          fase: 'Maturidade na Carreira',
          descricao:
            'Reconhecimento como referência na área escolhida, supervisão de outros profissionais, docência em instituições de ensino ou direção de clínicas especializadas.',
        },
      ],
    },
  },
  {
    id: 'logistica',
    titulo: 'Logística',
    emoji: '📦',
    imagem: '/imagens/cursos/img_logistica.jpg',
    descricao:
      'Já pensou ser a mente por trás do funcionamento das empresas? A Logística é a área que garante que produtos e serviços cheguem ao destino certo, no tempo certo. É como fazer o mundo girar de forma organizada e eficiente.',
    areas: [
      'Gestão de estoques – garantindo que nada falte e nada sobre.',
      'Transportes – planejando rotas e otimizando entregas.',
      'Comércio exterior – cuidando da importação e exportação de produtos.',
      'Grandes indústrias – organizando toda a cadeia de produção e distribuição.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'A Logística é fundamental para praticamente todos os setores da economia. Com o crescimento do e-commerce e o aumento da complexidade das cadeias de suprimentos globais, profissionais qualificados são altamente demandados tanto em empresas especializadas em logística quanto nos departamentos logísticos de indústrias, varejistas e empresas de serviços.',
      salario:
        'Profissionais iniciantes em Logística recebem em média entre R$ 2.800 e R$ 4.500, enquanto gestores de logística com experiência podem alcançar salários entre R$ 8.000 e R$ 15.000, especialmente em grandes operações ou comércio internacional.',
      habilidades: [
        'Organização e pensamento estratégico',
        'Gestão de tempo e recursos',
        'Conhecimento em sistemas de informação logísticos',
        'Resolução rápida de problemas',
        'Habilidade de negociação com fornecedores e clientes',
      ],
      trajetoria: [
        {
          fase: 'Entrada no Mercado',
          descricao:
            'Trabalho operacional em estoques, expedição ou como assistente logístico, aprendendo os fundamentos práticos da cadeia de suprimentos.',
        },
        {
          fase: 'Crescimento',
          descricao:
            'Especialização em uma área como transportes, armazenagem ou compras, assumindo funções de coordenação e planejamento logístico.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Gerenciamento de operações logísticas completas, supervisão de equipes, implementação de soluções de otimização e redução de custos.',
        },
        {
          fase: 'Liderança',
          descricao:
            'Direção logística em grandes empresas, consultoria especializada em Supply Chain ou empreendimento em serviços logísticos inovadores.',
        },
      ],
    },
  },
  {
    id: 'nutricao',
    titulo: 'Nutrição',
    emoji: '🥗',
    imagem: '/imagens/cursos/img_nutricao.jpg',
    descricao:
      'Você sabia que a alimentação é uma das maiores aliadas da saúde? O curso de Nutrição forma profissionais capazes de transformar hábitos, prevenir doenças e melhorar a qualidade de vida das pessoas através da comida.',
    areas: [
      'Nutrição clínica – atendendo em consultórios e hospitais, com foco em saúde individual.',
      'Nutrição esportiva – ajudando atletas e praticantes de atividades físicas a atingirem melhor desempenho.',
      'Indústria de alimentos – desenvolvendo e controlando a qualidade de novos produtos.',
      'Saúde pública – promovendo programas de educação alimentar em comunidades.',
      'Empreendedorismo – criando cardápios, consultorias ou negócios próprios na área de alimentação.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O mercado para nutricionistas é diversificado e crescente. Além das áreas tradicionais como consultórios e hospitais, há uma demanda crescente na nutrição esportiva, marketing nutricional, gastronomia funcional e consultorias para restaurantes e indústrias alimentícias. A crescente preocupação com alimentação saudável e sustentável expande continuamente o campo de atuação.',
      salario:
        'O salário inicial de um nutricionista varia de R$ 2.800 a R$ 5.000, podendo alcançar valores entre R$ 8.000 e R$ 15.000 para profissionais especializados e com carreira estabelecida em consultoria personalizada, marketing nutricional ou posições de gestão em grandes empresas.',
      habilidades: [
        'Conhecimento científico sobre alimentos e metabolismo',
        'Capacidade de traduzir ciência em orientações práticas',
        'Empatia e habilidade de comunicação',
        'Criatividade para desenvolver cardápios e programas',
        'Visão holística da relação entre alimentação e saúde',
      ],
      trajetoria: [
        {
          fase: 'Início da Carreira',
          descricao:
            'Atuação em hospitais, clínicas ou restaurantes coletivos, aprendendo a aplicar os conhecimentos teóricos e construindo experiência prática com diferentes públicos.',
        },
        {
          fase: 'Desenvolvimento',
          descricao:
            'Especialização em áreas como nutrição esportiva, materno-infantil ou comportamental, começando a construir uma abordagem personalizada e conquistando clientes fiéis.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Estabelecimento de consultório próprio, desenvolvimento de programas nutricionais diferenciados ou coordenação de equipes em empresas e hospitais.',
        },
        {
          fase: 'Maturidade Profissional',
          descricao:
            'Reconhecimento como especialista na área escolhida, desenvolvimento de produtos ou serviços próprios, consultoria para grandes empresas ou atuação como referência em mídias e publicações.',
        },
      ],
    },
  },
  {
    id: 'sistemasinformacao',
    titulo: 'Sistemas de Informação',
    emoji: '💻',
    imagem: '/imagens/cursos/img_sistemaInformacao.jpg',
    descricao:
      'No mundo atual, dados e tecnologia são o coração das empresas. O curso de Sistemas de Informação forma profissionais capazes de integrar tecnologia, gestão e estratégia para transformar informações em soluções inteligentes.',
    areas: [
      'Gestão de TI – administrando a infraestrutura tecnológica de empresas.',
      'Análise de dados e Big Data – transformando informações em decisões estratégicas.',
      'Segurança da informação – protegendo dados contra ataques digitais.',
      'Consultoria tecnológica – ajudando organizações a inovarem com tecnologia.',
      'Desenvolvimento de sistemas – criando softwares e ferramentas sob medida.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O profissional de Sistemas de Informação é requisitado em praticamente todos os setores da economia, desde empresas de tecnologia até áreas financeiras, industriais e governamentais. Com a crescente digitalização dos negócios e a importância estratégica dos dados, há uma demanda constante por profissionais que unem conhecimento técnico e visão de negócio.',
      salario:
        'O salário inicial varia entre R$ 3.500 e R$ 6.000, podendo alcançar valores entre R$ 10.000 e R$ 20.000 ou mais para posições de arquitetura de sistemas, gerência de TI ou consultoria especializada em grandes projetos.',
      habilidades: [
        'Conhecimento técnico em tecnologia da informação',
        'Visão estratégica de negócios',
        'Capacidade analítica e resolução de problemas',
        'Adaptabilidade a novas tecnologias',
        'Comunicação e tradução de termos técnicos para a linguagem de negócios',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Atuação como analista de sistemas júnior, desenvolvedor ou suporte técnico, adquirindo familiaridade com as tecnologias e processos de negócio.',
        },
        {
          fase: 'Desenvolvimento Intermediário',
          descricao:
            'Especialização em áreas como análise de dados, segurança da informação ou arquitetura de sistemas, assumindo projetos de maior complexidade.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Coordenação de equipes de TI, gerenciamento de projetos estratégicos ou atuação como consultor especializado, desenvolvendo soluções personalizadas para necessidades complexas.',
        },
        {
          fase: 'Posições Executivas',
          descricao:
            'Cargos como CIO (Chief Information Officer), CTO (Chief Technology Officer) ou consultor estratégico de transformação digital, direcionando decisões tecnológicas que impactam toda a organização.',
        },
      ],
    },
  },
  {
    id: 'ads',
    titulo: 'Análise e Desenvolvimento de Sistemas (ADS)',
    emoji: '🖥️',
    imagem: '/imagens/cursos/img_ads.jpg',
    descricao:
      'Se você gosta de programação e sonha em criar aplicativos, softwares e sistemas digitais, ADS é o curso certo para você! Ele foca no desenvolvimento prático de soluções tecnológicas que usamos no dia a dia.',
    areas: [
      'Desenvolvimento web e mobile – criando sites, aplicativos e sistemas modernos.',
      'Banco de dados – estruturando e gerenciando informações de empresas.',
      'Inteligência artificial e automação – programando máquinas inteligentes.',
      'Manutenção e testes de sistemas – garantindo qualidade e segurança.',
      'Startups e inovação – desenvolvendo produtos digitais inovadores.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O mercado para desenvolvedores de sistemas está entre os mais aquecidos e promissores. Há oportunidades em empresas de todos os portes, desde startups até multinacionais, além da possibilidade de trabalho remoto para empresas do exterior. A crescente digitalização dos negócios e a demanda por aplicativos e sistemas web mantêm constante a procura por profissionais qualificados.',
      salario:
        'Desenvolvedores iniciantes ganham em média entre R$ 3.000 e R$ 5.000, enquanto desenvolvedores experientes podem alcançar salários entre R$ 8.000 e R$ 20.000, dependendo da especialização, experiência e domínio de tecnologias de alta demanda.',
      habilidades: [
        'Lógica de programação e resolução de problemas',
        'Domínio de linguagens de programação',
        'Conhecimento em bancos de dados e arquitetura de sistemas',
        'Capacidade de aprender novas tecnologias constantemente',
        'Trabalho em equipe usando metodologias ágeis',
      ],
      trajetoria: [
        {
          fase: 'Desenvolvedor Júnior',
          descricao:
            'Trabalho com códigos mais simples, participação em projetos menores e aprendizado das boas práticas de programação sob orientação de profissionais mais experientes.',
        },
        {
          fase: 'Desenvolvedor Pleno',
          descricao:
            'Maior autonomia no desenvolvimento, participação em todas as fases de projetos mais complexos e especialização em determinadas linguagens ou frameworks.',
        },
        {
          fase: 'Desenvolvedor Sênior',
          descricao:
            'Liderança técnica de projetos, mentoria de desenvolvedores menos experientes e participação nas decisões de arquitetura e tecnologia dos sistemas.',
        },
        {
          fase: 'Arquiteto de Software ou Tech Lead',
          descricao:
            'Definição de padrões e arquiteturas para grandes sistemas, tomada de decisões técnicas estratégicas ou desenvolvimento de soluções inovadoras que impactam toda a organização.',
        },
      ],
    },
  },
  {
    id: 'direito',
    titulo: 'Direito',
    emoji: '⚖️',
    imagem: '/imagens/cursos/img_direito.jpg',
    descricao:
      'Ser advogado é ser a voz da justiça! O curso de Direito prepara profissionais para defender direitos, interpretar leis e atuar em grandes decisões que impactam a sociedade.',
    areas: [
      'Advocacia – defendendo clientes em casos civis, criminais, trabalhistas e empresariais.',
      'Magistratura e promotorias – atuando como juiz ou promotor de justiça.',
      'Consultoria jurídica – assessorando empresas e instituições em questões legais.',
      'Defensoria pública – garantindo acesso à justiça para todos.',
      'Carreira acadêmica – pesquisando e ensinando sobre o direito e suas aplicações.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O Direito oferece um dos mais amplos leques de possibilidades profissionais, desde a advocacia privada até carreiras públicas de alto prestígio. Além das áreas tradicionais, novos campos como direito digital, ambiental e da saúde estão em crescimento constante, assim como a demanda por profissionais especializados em mediação de conflitos e compliance.',
      salario:
        'A remuneração varia amplamente conforme a área e a experiência. Advogados iniciantes ganham entre R$ 3.000 e R$ 7.000, enquanto profissionais experientes em escritórios renomados ou carreiras públicas como juízes e promotores podem receber entre R$ 25.000 e R$ 40.000 ou mais.',
      habilidades: [
        'Capacidade analítica e interpretativa',
        'Comunicação oral e escrita de excelência',
        'Negociação e argumentação',
        'Pensamento crítico e raciocínio lógico',
        'Atualização constante sobre legislação e jurisprudência',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Trabalho como advogado júnior em escritórios, como assessor jurídico ou em estágios no poder público, adquirindo experiência prática nos procedimentos legais e construindo rede de contatos.',
        },
        {
          fase: 'Desenvolvimento',
          descricao:
            'Especialização em uma ou mais áreas do direito como trabalhista, tributário ou civil, assumindo casos de maior complexidade e construindo reputação profissional.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Sociedade em escritório de advocacia, coordenação de departamento jurídico em empresas, aprovação em concursos públicos de carreira jurídica ou desenvolvimento de consultoria especializada.',
        },
        {
          fase: 'Maturidade Profissional',
          descricao:
            'Posição de sócio sênior em grandes escritórios, atuação como juiz ou promotor em instâncias superiores, docência em instituições renomadas ou consultoria jurídica estratégica para grandes corporações.',
        },
      ],
    },
  },
  {
    id: 'engenhariacivil',
    titulo: 'Engenharia Civil',
    emoji: '🏗️',
    imagem: '/imagens/cursos/img_engCivil.jpg',
    descricao:
      'Construir sonhos e transformar cidades é a missão da Engenharia Civil. É uma das engenharias mais tradicionais e indispensáveis, responsável por projetar e executar obras que mudam o espaço urbano e rural.',
    areas: [
      'Construção civil – projetando casas, prédios e grandes empreendimentos.',
      'Infraestrutura – desenvolvendo estradas, pontes, barragens e saneamento básico.',
      'Obras sustentáveis – criando projetos que respeitam o meio ambiente.',
      'Gestão de obras – liderando equipes e administrando projetos de construção.',
      'Consultoria e perícia – avaliando a qualidade e a segurança de obras.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'A Engenharia Civil mantém demanda constante no mercado de trabalho, com ciclos ligados ao desenvolvimento econômico e investimentos em infraestrutura. Profissionais podem atuar em construtoras, incorporadoras, escritórios de projetos, órgãos públicos e empresas de consultoria. Áreas como construção sustentável e tecnologias inovadoras de construção têm gerado novas oportunidades.',
      salario:
        'Engenheiros civis recém-formados ganham entre R$ 4.500 e R$ 7.000, enquanto profissionais experientes em posições de coordenação e gestão podem receber entre R$ 12.000 e R$ 25.000, especialmente em grandes projetos ou como consultores especializados.',
      habilidades: [
        'Conhecimentos técnicos em estruturas e materiais',
        'Capacidade de gerenciamento de projetos',
        'Visão espacial e interpretação de projetos',
        'Habilidade com softwares de modelagem e cálculo',
        'Liderança e coordenação de equipes multidisciplinares',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Atuação em canteiros de obras, auxiliar de projetos ou fiscalização, aprendendo aspectos práticos da construção e familiarizando-se com normas técnicas e procedimentos.',
        },
        {
          fase: 'Desenvolvimento',
          descricao:
            'Especialização em áreas como estruturas, hidráulica ou geotecnia, assumindo projetos menores com autonomia ou liderando aspectos específicos de grandes obras.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Gerenciamento de obras completas, coordenação de equipes de engenharia, desenvolvimento de projetos complexos ou consultoria especializada para grandes empreendimentos.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Direção técnica em grandes construtoras, posição de referência em escritórios de projetos, consultoria de alto nível ou empreendimento próprio no setor da construção civil.',
        },
      ],
    },
  },
  {
    id: 'estetica',
    titulo: 'Estética e Cosmética',
    emoji: '💄',
    imagem: '/imagens/cursos/img_estetica.jpg',
    descricao:
      'A beleza também é ciência! O curso de Estética e Cosmética vai muito além de técnicas: ele une saúde, bem-estar e autoestima, preparando profissionais para transformar a forma como as pessoas se sentem.',
    areas: [
      'Tratamentos faciais e corporais – cuidando da pele e da saúde estética.',
      'Estética avançada – aplicando recursos tecnológicos como laser, peelings e terapias modernas.',
      'Cosmetologia – desenvolvendo e testando produtos de beleza e cuidados pessoais.',
      'Spa e bem-estar – oferecendo experiências de cuidado e relaxamento.',
      'Estética clínica – trabalhando lado a lado com médicos dermatologistas e cirurgiões plásticos.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O mercado de estética e cosmética está em constante crescimento, impulsionado pela valorização dos cuidados pessoais e busca por bem-estar. Profissionais qualificados encontram oportunidades em clínicas de estética, spas, salões de beleza de luxo, indústria cosmética e até mesmo no desenvolvimento de seus próprios negócios e produtos.',
      salario:
        'A remuneração inicial varia entre R$ 2.500 e R$ 4.000, podendo alcançar valores entre R$ 8.000 e R$ 15.000 para especialistas em técnicas avançadas, proprietários de clínicas ou consultores da indústria cosmética.',
      habilidades: [
        'Conhecimento técnico-científico de procedimentos estéticos',
        'Habilidades manuais precisas',
        'Atualização constante sobre novas tecnologias e tratamentos',
        'Sensibilidade para entender necessidades e expectativas dos clientes',
        'Visão empreendedora e de gestão de negócios',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Atuação em clínicas de estética ou spas como técnico, realizando procedimentos básicos e aprendendo a lidar com equipamentos e protocolos de tratamento.',
        },
        {
          fase: 'Desenvolvimento',
          descricao:
            'Especialização em áreas como estética facial, corporal ou capilar, construindo clientela fiel e dominando técnicas mais avançadas e tecnologias específicas.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Abertura de negócio próprio, coordenação de equipe em grande clínica ou spa, ou desenvolvimento de protocolos exclusivos de tratamentos estéticos.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Expansão do próprio negócio com múltiplas unidades, consultoria para marcas de cosméticos, desenvolvimento de linha própria de produtos ou formação de novos profissionais através de cursos e workshops.',
        },
      ],
    },
  },
  {
    id: 'gestaoambiental',
    titulo: 'Gestão Ambiental',
    emoji: '🌍',
    imagem: '/imagens/cursos/img_GestaoAmbiental.jpg',
    descricao:
      'Proteger o meio ambiente é garantir o futuro da humanidade. O curso de Gestão Ambiental forma profissionais preparados para equilibrar desenvolvimento e sustentabilidade, criando soluções que respeitam a natureza.',
    areas: [
      'Sustentabilidade em empresas – implantando práticas de responsabilidade ambiental.',
      'Consultoria e auditoria – avaliando impactos e propondo melhorias.',
      'Recuperação ambiental – ajudando na preservação de florestas, rios e áreas degradadas.',
      'Gestão de resíduos – desenvolvendo projetos para reduzir e reciclar materiais.',
      'Políticas públicas – trabalhando em órgãos governamentais e ONGs ambientais.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'Com a crescente preocupação mundial com as questões ambientais e a pressão por práticas sustentáveis, o gestor ambiental encontra oportunidades em empresas de diversos setores, órgãos públicos de fiscalização e licenciamento, consultorias especializadas e ONGs. A demanda por profissionais aumenta com as exigências legais e a busca por certificações ambientais.',
      salario:
        'O salário inicial varia entre R$ 2.800 e R$ 5.000, podendo alcançar R$ 8.000 a R$ 15.000 para gestores ambientais em posições estratégicas em grandes empresas ou como consultores especializados em áreas como licenciamento ambiental e economia circular.',
      habilidades: [
        'Conhecimento técnico sobre legislação e normas ambientais',
        'Visão integrada de processos e seus impactos',
        'Capacidade de análise e solução de problemas complexos',
        'Habilidade para mediar conflitos entre desenvolvimento e preservação',
        'Conhecimento em tecnologias e práticas sustentáveis',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Trabalho como analista ambiental em empresas, órgãos públicos ou consultoria, realizando levantamentos, monitoramentos e auxiliando na implementação de práticas sustentáveis.',
        },
        {
          fase: 'Desenvolvimento',
          descricao:
            'Coordenação de projetos ambientais específicos, especialização em áreas como gestão de resíduos ou licenciamento, assumindo responsabilidade por relatórios e auditorias ambientais.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Gerenciamento de departamentos ambientais em empresas, liderança em consultorias especializadas ou participação na elaboração de políticas públicas ambientais em órgãos governamentais.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Direção de sustentabilidade em grandes corporações, consultoria estratégica para implementação de negócios sustentáveis ou liderança em organizações internacionais de proteção ambiental.',
        },
      ],
    },
  },
  {
    id: 'medicina',
    titulo: 'Medicina',
    emoji: '🩺',
    imagem: '/imagens/cursos/img_medicina.jpg',
    descricao:
      'Poucas profissões são tão reconhecidas quanto a Medicina. Ser médico é dedicar-se a salvar vidas, cuidar da saúde e estar presente nos momentos mais delicados da vida das pessoas. É ciência, empatia e vocação.',
    areas: [
      'Clínica geral – acompanhando pacientes em todas as fases da vida.',
      'Especialidades médicas – como cardiologia, pediatria, neurologia, psiquiatria, entre muitas outras.',
      'Cirurgia – realizando procedimentos que salvam e transformam vidas.',
      'Pesquisa e inovação – desenvolvendo novos tratamentos e tecnologias.',
      'Saúde pública – promovendo prevenção e bem-estar em comunidades.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'A Medicina oferece amplas possibilidades de carreira com demanda constante em praticamente todas as regiões. Além da atuação clínica tradicional, há oportunidades em pesquisa, gestão hospitalar, telemedicina, indústria farmacêutica e empresas de tecnologia em saúde. A especialização é um diferencial importante que abre portas para áreas específicas.',
      salario:
        'Os médicos recém-formados recebem entre R$ 10.000 e R$ 15.000 em posições como plantonistas ou clínicos gerais. Especialistas experientes podem ganhar entre R$ 20.000 e R$ 50.000 ou mais, dependendo da especialidade, localidade e tipo de atuação (consultório próprio, hospital privado, etc.).',
      habilidades: [
        'Conhecimento científico aprofundado',
        'Capacidade de diagnóstico e tomada de decisão',
        'Empatia e habilidades de comunicação com pacientes',
        'Atualização constante com avanços médicos',
        'Resiliência emocional para lidar com situações críticas',
      ],
      trajetoria: [
        {
          fase: 'Formação Inicial',
          descricao:
            'Após a graduação, residência médica de 2 a 5 anos para especialização em áreas como clínica médica, pediatria, cirurgia, ginecologia, entre outras.',
        },
        {
          fase: 'Consolidação Profissional',
          descricao:
            'Estabelecimento em hospitais, clínicas ou postos de saúde, construção de reputação e experiência, podendo realizar subespecializações para áreas mais específicas.',
        },
        {
          fase: 'Carreira Estabelecida',
          descricao:
            'Desenvolvimento de consultório próprio, coordenação de equipes médicas em hospitais, participação em pesquisas clínicas ou atuação como referência em sua especialidade.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Direção de departamentos hospitalares, participação em conselhos médicos, formação de novos médicos como professor universitário ou empreendedorismo na área da saúde.',
        },
      ],
    },
  },
  {
    id: 'odontologia',
    titulo: 'Odontologia',
    emoji: '😁',
    imagem: '/imagens/cursos/img_dontologia.jpg',
    descricao:
      'Muito além de sorrisos bonitos, a Odontologia é a ciência que cuida da saúde da boca e contribui para a saúde geral do corpo. O cirurgião-dentista é responsável por prevenir doenças, restaurar funções e devolver autoestima.',
    areas: [
      'Clínica geral – cuidando da saúde bucal em todas as idades.',
      'Ortodontia – alinhando dentes e transformando sorrisos.',
      'Odontopediatria – cuidando da saúde bucal das crianças.',
      'Cirurgia bucomaxilofacial – tratando casos mais complexos.',
      'Estética odontológica – devolvendo confiança através do sorriso.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'A Odontologia oferece possibilidades tanto no setor público quanto privado. O mercado para clínicas particulares é competitivo em grandes centros, mas há demanda constante, especialmente para profissionais especializados. Áreas como odontologia estética, ortodontia e implantodontia têm apresentado crescimento expressivo, assim como a odontologia hospitalar e para pacientes com necessidades especiais.',
      salario:
        'Dentistas recém-formados ganham entre R$ 4.000 e R$ 8.000 trabalhando em clínicas ou no setor público. Especialistas com consultório estabelecido podem alcançar rendimentos entre R$ 15.000 e R$ 30.000 ou mais, dependendo da especialidade e localidade.',
      habilidades: [
        'Habilidade manual e coordenação motora fina',
        'Conhecimento técnico-científico odontológico',
        'Senso estético apurado',
        'Empatia e capacidade de acalmar pacientes ansiosos',
        'Visão empreendedora para gestão de consultório',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Trabalho como clínico geral em consultórios estabelecidos, clínicas populares ou serviço público, adquirindo experiência prática e construindo relacionamento com pacientes.',
        },
        {
          fase: 'Desenvolvimento',
          descricao:
            'Especialização em áreas como ortodontia, endodontia, implantodontia ou odontopediatria, começando a atender casos mais específicos e complexos.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Estabelecimento de consultório próprio, construção de carteira de pacientes fiéis, realização de procedimentos avançados e possivelmente formação de equipe.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Reconhecimento como referência na especialidade escolhida, coordenação de clínica com múltiplos profissionais, docência em cursos de odontologia ou desenvolvimento de técnicas e protocolos inovadores.',
        },
      ],
    },
  },
  {
    id: 'terapiaocupacional',
    titulo: 'Terapia Ocupacional',
    emoji: '👐',
    imagem: '/imagens/cursos/img_terapia.jpg',
    descricao:
      'Ajudar pessoas a recuperarem autonomia e conquistarem independência é a essência da Terapia Ocupacional. O terapeuta ocupacional atua com criatividade e empatia, promovendo inclusão e qualidade de vida.',
    areas: [
      'Reabilitação física – ajudando pessoas a recuperarem movimentos após acidentes ou doenças.',
      'Saúde mental – apoiando pacientes no enfrentamento de transtornos e dificuldades emocionais.',
      'Educação inclusiva – auxiliando crianças com necessidades especiais no aprendizado.',
      'Atendimento a idosos – promovendo bem-estar e independência na terceira idade.',
      'Comunidade e inclusão social – criando projetos que estimulam a participação social.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'Os terapeutas ocupacionais encontram oportunidades crescentes em hospitais, clínicas de reabilitação, escolas inclusivas, instituições para idosos e organizações sociais. O envelhecimento da população e a maior atenção à saúde mental e inclusão social têm ampliado o campo de atuação, especialmente em equipes multidisciplinares de saúde e assistência.',
      salario:
        'Profissionais em início de carreira recebem entre R$ 2.800 e R$ 4.500, podendo chegar a R$ 8.000 ou mais com experiência e especializações em áreas como reabilitação neurológica, saúde mental ou gerontologia.',
      habilidades: [
        'Criatividade para desenvolver atividades terapêuticas',
        'Empatia e sensibilidade com diferentes condições',
        'Capacidade de análise e adaptação de atividades',
        'Paciência e persistência no processo terapêutico',
        'Conhecimento técnico em anatomia e condições de saúde',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Atuação em equipes multidisciplinares de hospitais, clínicas ou instituições sociais, aplicando técnicas básicas de terapia ocupacional e aprendendo na prática.',
        },
        {
          fase: 'Especialização',
          descricao:
            'Foco em uma área específica como pediatria, gerontologia ou saúde mental, desenvolvendo métodos terapêuticos personalizados e construindo experiência clínica.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Coordenação de setores de terapia ocupacional, atendimento particular especializado ou desenvolvimento de programas de reabilitação em instituições.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Consultoria para instituições de saúde, desenvolvimento de metodologias próprias de tratamento, docência em instituições de ensino ou empreendimento em serviços especializados de reabilitação.',
        },
      ],
    },
  },
  {
    id: 'arquitetura',
    titulo: 'Arquitetura e Urbanismo',
    emoji: '🏛️',
    imagem: '/imagens/cursos/img_ArquitUrbanismo.jpg',
    descricao:
      'Transformar espaços em lugares cheios de vida é a missão da Arquitetura e Urbanismo. O curso une arte, criatividade e técnica para projetar ambientes que inspiram, acolhem e melhoram a vida das pessoas.',
    areas: [
      'Arquitetura residencial e comercial – criando casas, prédios e espaços inovadores.',
      'Urbanismo – planejando cidades mais organizadas, seguras e sustentáveis.',
      'Design de interiores – transformando ambientes em experiências únicas.',
      'Preservação do patrimônio histórico – restaurando e valorizando a memória cultural.',
      'Construções sustentáveis – aplicando soluções para reduzir impactos ambientais.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O mercado para arquitetos é amplo, incluindo escritórios de arquitetura, construtoras, incorporadoras, setor público e consultorias. Áreas como arquitetura sustentável, projetos de interiores e consultorias técnicas têm apresentado crescimento. A possibilidade de atuar como profissional autônomo ou empreendedor também abre caminhos para carreiras diversificadas.',
      salario:
        'Arquitetos em início de carreira recebem entre R$ 3.500 e R$ 6.000, enquanto profissionais experientes e com portfolio consolidado podem alcançar rendimentos entre R$ 10.000 e R$ 25.000 ou mais, especialmente com escritório próprio e projetos de grande porte.',
      habilidades: [
        'Criatividade e visão espacial',
        'Conhecimento técnico de construção e materiais',
        'Domínio de softwares específicos de projeto e modelagem',
        'Sensibilidade para entender necessidades humanas no espaço',
        'Capacidade de equilibrar estética, funcionalidade e viabilidade',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Trabalho em escritórios de arquitetura como assistente, desenvolvendo detalhamentos, auxiliando em projetos e aprendendo os aspectos práticos da profissão.',
        },
        {
          fase: 'Arquiteto Júnior',
          descricao:
            'Maior autonomia em projetos menores, desenvolvimento de especialidade em uma área como residências, interiores ou paisagismo, início da construção de portfolio próprio.',
        },
        {
          fase: 'Arquiteto Sênior',
          descricao:
            'Coordenação de projetos completos, gestão de equipes de projeto, consolidação de estilo próprio e possivelmente estabelecimento de escritório independente.',
        },
        {
          fase: 'Carreira Consolidada',
          descricao:
            'Direção de escritório de arquitetura reconhecido, desenvolvimento de projetos de grande impacto, participação em concursos internacionais ou docência em instituições de prestígio.',
        },
      ],
    },
  },
  {
    id: 'educacaofisica',
    titulo: 'Educação Física',
    emoji: '🏋️',
    imagem: '/imagens/cursos/img_edFisica.jpg',
    descricao:
      'Movimento é vida! O curso de Educação Física forma profissionais que promovem saúde, bem-estar e desempenho por meio da atividade física. É uma carreira vibrante, cheia de energia e propósito.',
    areas: [
      'Academias e esportes – treinando pessoas e equipes.',
      'Recreação e lazer – criando experiências que unem diversão e atividade física.',
      'Educação escolar – ensinando crianças e jovens a desenvolverem hábitos saudáveis.',
      'Fisiologia do exercício – ajudando atletas a atingirem alta performance.',
      'Saúde coletiva – promovendo projetos de prevenção e qualidade de vida.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'A Educação Física oferece um mercado versátil, com oportunidades em escolas, academias, clubes esportivos, clínicas de reabilitação e assessoria esportiva. Com a crescente preocupação com saúde e qualidade de vida, áreas como treinamento personalizado, preparação física para idosos e reabilitação através do exercício estão em expansão.',
      salario:
        'Profissionais iniciantes recebem entre R$ 2.500 e R$ 4.000 em academias e escolas. Com especialização e experiência, é possível alcançar rendimentos de R$ 6.000 a R$ 15.000, especialmente como personal trainer com clientela estabelecida ou coordenador técnico em grandes redes.',
      habilidades: [
        'Conhecimento técnico sobre movimento e fisiologia humana',
        'Capacidade de motivação e comunicação',
        'Planejamento e progressão de treinamentos',
        'Adaptabilidade para diferentes públicos e necessidades',
        'Atualização constante sobre novas metodologias de treino',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Atuação como professor em escolas, instrutor em academias ou auxiliar em equipes esportivas, adquirindo experiência prática com diferentes públicos.',
        },
        {
          fase: 'Especialização',
          descricao:
            'Foco em uma área específica como musculação, funcional, pilates, esportes coletivos ou educação física escolar, desenvolvendo metodologia própria de trabalho.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Estabelecimento como personal trainer com carteira de clientes fixa, coordenação técnica em academias, ou posição estável em instituições de ensino.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Empreendimento próprio como estúdio de treinamento, consultoria para atletas de alto rendimento, coordenação de departamentos de educação física ou docência em faculdades da área.',
        },
      ],
    },
  },
  {
    id: 'engenhariaeletrica',
    titulo: 'Engenharia Elétrica',
    emoji: '⚡',
    imagem: '/imagens/cursos/img_EngEletrica.jpg',
    descricao:
      'Energia é o que move o mundo, e a Engenharia Elétrica é a área responsável por controlar, criar e inovar nesse campo. O engenheiro elétrico trabalha em projetos que vão da eletrônica ao desenvolvimento de energias renováveis.',
    areas: [
      'Sistemas de energia – projetando redes elétricas para cidades e indústrias.',
      'Telecomunicações – criando soluções para comunicação digital e redes.',
      'Automação industrial – desenvolvendo sistemas inteligentes para fábricas.',
      'Eletrônica e tecnologia – projetando circuitos e dispositivos inovadores.',
      'Energias renováveis – criando projetos de energia solar, eólica e sustentável.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'Os engenheiros elétricos são requisitados em diversos setores como concessionárias de energia, indústrias, empresas de telecomunicações e automação. Com o avanço da eletrificação, energias renováveis, carros elétricos e indústria 4.0, o mercado está em constante expansão, oferecendo oportunidades para especialistas em novas tecnologias.',
      salario:
        'O salário inicial varia entre R$ 4.500 e R$ 7.500, podendo chegar a R$ 15.000 ou mais para profissionais experientes, especialmente em posições de gestão de projetos, coordenação de equipes técnicas ou áreas de alta especialização como smart grids e eletrônica embarcada.',
      habilidades: [
        'Raciocínio lógico e matemático',
        'Conhecimento técnico em eletricidade e eletrônica',
        'Capacidade de resolver problemas complexos',
        'Habilidade com softwares específicos e simulação',
        'Visão sistêmica de projetos elétricos',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Atuação como engenheiro júnior em projetos elétricos, assistente em equipes técnicas ou suporte em manutenção elétrica, aplicando conhecimentos teóricos em situações práticas.',
        },
        {
          fase: 'Desenvolvimento',
          descricao:
            'Especialização em áreas como automação industrial, sistemas de potência ou telecomunicações, assumindo projetos com maior autonomia e complexidade técnica.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Gerenciamento de projetos elétricos completos, coordenação de equipes técnicas ou desenvolvimento de soluções inovadoras para desafios específicos do setor.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Direção técnica em grandes empresas, consultoria especializada em projetos complexos ou empreendedorismo em nichos tecnológicos como eficiência energética e sistemas inteligentes.',
        },
      ],
    },
  },
  {
    id: 'fisioterapia',
    titulo: 'Fisioterapia',
    emoji: '🦵',
    imagem: '/imagens/cursos/img_fisioterapia.jpg',
    descricao:
      'Restaurar movimentos, aliviar dores e devolver qualidade de vida: essa é a missão da Fisioterapia. É uma profissão que une ciência, saúde e cuidado humano em cada atendimento.',
    areas: [
      'Ortopedia e traumatologia – ajudando na recuperação após lesões e cirurgias.',
      'Fisioterapia esportiva – acompanhando atletas na prevenção e tratamento de lesões.',
      'Neurologia – apoiando pacientes em reabilitações complexas.',
      'Fisioterapia respiratória – auxiliando em tratamentos que melhoram a função pulmonar.',
      'Estética e bem-estar – aplicando técnicas que unem saúde e autoestima.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O mercado para fisioterapeutas apresenta crescimento consistente, impulsionado pelo envelhecimento populacional e maior conscientização sobre qualidade de vida. Há demanda em hospitais, clínicas de reabilitação, home care, clubes esportivos e atendimento domiciliar. Áreas como fisioterapia esportiva, dermatofuncional e neurofuncional têm se destacado como especialidades em expansão.',
      salario:
        'Fisioterapeutas recém-formados recebem entre R$ 2.800 e R$ 4.500 em clínicas e hospitais. Com especialização e experiência, é possível alcançar rendimentos entre R$ 7.000 e R$ 15.000, especialmente em consultório próprio com técnicas específicas ou atendendo atletas de alto rendimento.',
      habilidades: [
        'Conhecimento anatômico e biomecânico aprofundado',
        'Habilidade manual para técnicas terapêuticas',
        'Empatia e capacidade de motivação',
        'Raciocínio clínico para avaliar e tratar condições',
        'Atualização constante em novas técnicas e equipamentos',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Trabalho em clínicas multiprofissionais, hospitais ou home care, adquirindo experiência prática com diferentes patologias e técnicas terapêuticas básicas.',
        },
        {
          fase: 'Especialização',
          descricao:
            'Foco em uma área específica como ortopedia, neurologia ou respiratória, dominando técnicas avançadas e criando abordagens personalizadas de tratamento.',
        },
        {
          fase: 'Consolidação Profissional',
          descricao:
            'Estabelecimento de consultório próprio, participação em equipes de saúde de referência ou especialização em atendimentos de alta complexidade em grandes centros.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Reconhecimento como especialista em sua área, desenvolvimento de protocolos próprios de tratamento, gestão de clínicas especializadas ou docência em cursos de fisioterapia.',
        },
      ],
    },
  },
  {
    id: 'rh',
    titulo: 'Gestão de Recursos Humanos (RH)',
    emoji: '👥',
    imagem: '/imagens/cursos/img_GestaoRecursoHumanos.jpg',
    descricao:
      'Cuidar de pessoas é cuidar de empresas. A Gestão de Recursos Humanos forma profissionais que desenvolvem talentos, constroem equipes de sucesso e criam ambientes de trabalho saudáveis.',
    areas: [
      'Recrutamento e seleção – encontrando os talentos certos para cada empresa.',
      'Treinamento e desenvolvimento – capacitando profissionais para crescerem.',
      'Gestão de desempenho – acompanhando e melhorando resultados.',
      'Cultura organizacional – fortalecendo valores e motivação dentro das empresas.',
      'Consultoria em RH – oferecendo soluções estratégicas para diferentes negócios.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'Os profissionais de RH são necessários em empresas de todos os portes e segmentos. Com a transformação digital e novas formas de trabalho, áreas como employee experience, gestão de talentos e people analytics estão em alta. O foco em bem-estar, diversidade e produtividade tem ampliado o papel estratégico do RH nas organizações.',
      salario:
        'Analistas de RH iniciantes recebem entre R$ 2.500 e R$ 4.000, enquanto gestores e especialistas podem alcançar salários entre R$ 8.000 e R$ 20.000 em grandes empresas, especialmente em posições como diretor de RH ou consultor especializado em transformação organizacional.',
      habilidades: [
        'Inteligência emocional e habilidades interpessoais',
        'Conhecimento de legislação trabalhista',
        'Visão estratégica do negócio',
        'Capacidade analítica para métricas de pessoas',
        'Comunicação e mediação de conflitos',
      ],
      trajetoria: [
        {
          fase: 'Assistente/Analista Júnior',
          descricao:
            'Atuação em processos operacionais de RH como folha de pagamento, benefícios, recrutamento inicial e suporte administrativo, aprendendo os fundamentos da área.',
        },
        {
          fase: 'Analista Pleno/Sênior',
          descricao:
            'Especialização em subsistemas específicos como treinamento e desenvolvimento, remuneração ou atração de talentos, conduzindo projetos com maior autonomia.',
        },
        {
          fase: 'Coordenação/Gerência',
          descricao:
            'Gestão de equipes de RH, implementação de políticas corporativas de pessoas ou consultoria interna para líderes de diferentes departamentos.',
        },
        {
          fase: 'Diretoria/Consultoria',
          descricao:
            'Definição de estratégias de gestão de pessoas alinhadas ao negócio, liderança em transformações culturais ou consultoria especializada para múltiplas organizações.',
        },
      ],
    },
  },
  {
    id: 'veterinaria',
    titulo: 'Medicina Veterinária',
    emoji: '🐾',
    imagem: '/imagens/cursos/img_veterinaria.jpg',
    descricao:
      'Cuidar da saúde dos animais é mais do que uma profissão, é um ato de amor e dedicação. O curso de Medicina Veterinária prepara profissionais para proteger a vida animal, garantir o bem-estar e até mesmo colaborar com a saúde humana através do controle de zoonoses.',
    areas: [
      'Clínica de pequenos animais – atendendo cães, gatos e animais de estimação.',
      'Clínica de grandes animais – cuidando da saúde de cavalos, bovinos e animais de produção.',
      'Saúde pública – trabalhando na prevenção de doenças transmitidas por animais.',
      'Indústria alimentícia – fiscalizando e garantindo a qualidade de produtos de origem animal.',
      'Pesquisa e biotecnologia – desenvolvendo vacinas, medicamentos e inovações para o setor.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'O mercado para médicos veterinários tem crescido significativamente, impulsionado pelo aumento no número de animais de estimação e maior preocupação com seu bem-estar. Há oportunidades em clínicas veterinárias, hospitais, agropecuárias, indústrias de alimentos e medicamentos, órgãos públicos e pesquisa. Áreas como medicina de animais silvestres, dermatologia veterinária e comportamento animal ganham destaque.',
      salario:
        'Profissionais em início de carreira recebem entre R$ 3.000 e R$ 5.000 em clínicas e hospitais veterinários. Com especialização e experiência, especialmente em áreas como cirurgia veterinária ou diagnóstico por imagem, os salários podem alcançar R$ 8.000 a R$ 15.000, enquanto proprietários de clínicas bem-sucedidas ou consultores especializados podem obter rendimentos superiores.',
      habilidades: [
        'Conhecimento profundo de anatomia e fisiologia animal',
        'Habilidades clínicas e cirúrgicas',
        'Empatia e comunicação com tutores',
        'Atualização constante sobre tratamentos e procedimentos',
        'Capacidade de diagnóstico e tomada de decisão rápida',
      ],
      trajetoria: [
        {
          fase: 'Início de Carreira',
          descricao:
            'Atuação em clínicas veterinárias como assistente ou plantonista, trabalho em pet shops com serviços veterinários ou em fazendas e empresas de agropecuária como veterinário de campo.',
        },
        {
          fase: 'Especialização',
          descricao:
            'Foco em uma área específica como dermatologia, oncologia, ortopedia ou comportamento animal, com residência e cursos de especialização para aprofundamento técnico.',
        },
        {
          fase: 'Consolidação',
          descricao:
            'Estabelecimento de clínica própria, posição de destaque em hospitais veterinários, atuação como especialista reconhecido ou cargo de responsabilidade técnica em indústrias do setor.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Referência em sua especialidade, proprietário de hospital veterinário, consultor internacional, pesquisador em desenvolvimento de tratamentos inovadores ou docente em universidades formando novos profissionais.',
        },
      ],
    },
  },
  {
    id: 'psicologia',
    titulo: 'Psicologia',
    emoji: '🧠',
    imagem: '/imagens/cursos/img_psicologia.jpg',
    descricao:
      'Compreender a mente humana é um dos maiores desafios da ciência. O curso de Psicologia forma profissionais que ajudam pessoas a lidarem com emoções, comportamentos e relações, promovendo equilíbrio e bem-estar.',
    areas: [
      'Psicologia clínica – acompanhando pessoas em seus desafios emocionais e psicológicos.',
      'Psicologia organizacional – cuidando da saúde mental dentro das empresas.',
      'Psicologia escolar – apoiando crianças e jovens no desenvolvimento educacional.',
      'Psicologia esportiva – ajudando atletas a alcançarem alto desempenho emocional.',
      'Pesquisa e docência – estudando o comportamento humano e formando novos profissionais.',
    ],
    carreiraInfo: {
      mercadoTrabalho:
        'A demanda por psicólogos tem crescido com a maior conscientização sobre saúde mental. Há oportunidades em clínicas, hospitais, escolas, empresas, ONGs e consultorias. Áreas como psicologia online, neuropsicologia, terapias específicas (como TCC e EMDR) e atuação com públicos específicos (como idosos ou população LGBTQIA+) estão em expansão.',
      salario:
        'Psicólogos em início de carreira recebem entre R$ 2.500 e R$ 4.000 em clínicas e instituições. Com especialização, experiência e construção de clientela, os rendimentos podem variar de R$ 6.000 a R$ 15.000, principalmente em consultório próprio, atendimento a pacientes particulares ou posições em grandes empresas.',
      habilidades: [
        'Escuta ativa e empatia',
        'Capacidade analítica e interpretativa',
        'Ética profissional rigorosa',
        'Equilíbrio emocional',
        'Conhecimento sobre teorias e técnicas terapêuticas',
      ],
      trajetoria: [
        {
          fase: 'Formação Inicial',
          descricao:
            'Atuação em clínicas supervisionadas, ONGs, projetos sociais ou como auxiliar em equipes multidisciplinares, desenvolvendo a prática profissional e definindo áreas de interesse.',
        },
        {
          fase: 'Especialização',
          descricao:
            'Foco em uma abordagem terapêutica (como psicanálise, terapia cognitivo-comportamental ou análise do comportamento) ou área específica (como neuropsicologia ou psicologia infantil).',
        },
        {
          fase: 'Estabelecimento Profissional',
          descricao:
            'Desenvolvimento de carreira em consultório próprio, posições em instituições de referência ou empresas, construção de reputação e rede de pacientes ou clientes.',
        },
        {
          fase: 'Carreira Avançada',
          descricao:
            'Reconhecimento como especialista, formação de outros profissionais, desenvolvimento de pesquisas, publicação de obras ou gestão de clínicas e equipes de saúde mental.',
        },
      ],
    },
  },
];

// Agrupando cursos por áreas principais
const categoriasCursos: CategoriasCursos = {
  'Saúde e Bem-estar': cursos.filter(
    (curso) =>
      [
        'medicina',
        'enfermagem',
        'odontologia',
        'fisioterapia',
        'nutricao',
        'psicologia',
        'fonoaudiologia',
        'biomedicina',
        'terapiaocupacional',
        'estetica',
        'veterinaria',
      ].indexOf(curso.id) !== -1,
  ),

  'Exatas e Tecnologia': cursos.filter(
    (curso) =>
      [
        'sistemasinformacao',
        'ads',
        'engenhariacivil',
        'engenhariaMecanica',
        'engenhariaeletrica',
      ].indexOf(curso.id) !== -1,
  ),

  'Ciências Humanas e Sociais': cursos.filter(
    (curso) => ['direito', 'psicologia', 'arquitetura', 'educacaofisica'].indexOf(curso.id) !== -1,
  ),

  'Meio Ambiente e Sustentabilidade': cursos.filter(
    (curso) => ['agronomia', 'gestaoambiental'].indexOf(curso.id) !== -1,
  ),

  'Gestão e Negócios': cursos.filter((curso) => ['logistica', 'rh'].indexOf(curso.id) !== -1),
};

// Cursos em destaque para o carrossel
const cursosDestaque = [
  cursos.find((c) => c.id === 'medicina')!,
  cursos.find((c) => c.id === 'direito')!,
  cursos.find((c) => c.id === 'sistemasinformacao')!,
  cursos.find((c) => c.id === 'engenhariaMecanica')!,
];

export default function PaginaHome() {
  const { authResolved, usuario } = useAuthContext();
  const router = useRouter();
  const { pessoa, loading } = usePessoa();
  const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('Todos');
  const [showStepper, setShowStepper] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  // Armazena o passo mais avançado que o usuário já visitou
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [config, setConfig] = useState({
    testeVocacionalId: 2,
    testeSubareaId: 3,
  });
  const [subareaTesteId, setSubareaTesteId] = useState<number | null>(null);
  const steps = ['Teste', 'Áreas', 'Especialidade', 'Cursos', 'Confirmar', 'Perfil'];

  // Exibe o stepper em fullpage se não houver pessoa vinculada
  useEffect(() => {
    if (!loading && !pessoa) {
      setShowStepper(true);
    }
  }, [loading, pessoa]);

  // Carrega as configurações da aplicação
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const appConfig = await configService.getConfig();
        setConfig(appConfig);
        console.log('Configurações carregadas:', appConfig);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };

    loadConfig();
  }, []);

  // Função para navegar para um passo específico
  const navigateToStep = (step: number) => {
    if (step <= maxVisitedStep) {
      setCurrentStep(step);
    }
  };

  // Função para avançar para o próximo passo
  const goToNextStep = (step: number) => {
    setCurrentStep(step);
    // Atualiza o passo máximo visitado, se necessário
    if (step > maxVisitedStep) {
      setMaxVisitedStep(step);
    }
  };

  // Função para filtrar cursos por categoria
  const getCursosFiltrados = () => {
    if (categoriaAtiva === 'Todos') {
      return cursos;
    }
    return categoriasCursos[categoriaAtiva] || [];
  };

  const renderContent = () => {
    if (showStepper) {
      return (
        <Stepper
          steps={steps}
          currentStep={currentStep}
          maxVisitedStep={maxVisitedStep}
          onStepClick={navigateToStep}
          fullpage
        >
          {/* Passo 1 - Teste Vocacional */}
          {currentStep === 0 && config.testeVocacionalId && (
            <VocationalTestStepper
              testeId={config.testeVocacionalId} // ID do teste vocacional das configurações
              usuarioId={usuario?.usuId ?? 0} // Usar ID do usuário autenticado, não da pessoa
              onFinish={() => goToNextStep(1)}
            />
          )}
          {currentStep === 0 && !config.testeVocacionalId && (
            <div className="w-full flex flex-col flex-1 max-w-2xl mx-auto bg-white/90 p-10 border-t border-x border-zinc-100 min-h-[400px] justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Teste não disponível</h2>
                <p className="mb-4">O teste vocacional não está configurado no sistema.</p>
                <p>Por favor, entre em contato com o administrador.</p>
              </div>
            </div>
          )}
          {/* Passo 2 - Resultado do Teste Vocacional */}
          {currentStep === 1 && config.testeVocacionalId && (
            <VocationalTestResultStepper
              testeId={config.testeVocacionalId}
              usuarioId={usuario?.usuId ?? 0} // Usar ID do usuário autenticado, não da pessoa
              onBack={() => navigateToStep(0)}
              onNext={async (areaId) => {
                setSelectedAreaId(areaId);

                // Busca o teste de subárea específico para a área selecionada
                try {
                  const subareaConfig = await configService.getTesteSubareaByArea(areaId);
                  setSubareaTesteId(subareaConfig.testeSubareaId);
                  console.log(
                    'Teste de subárea para área',
                    areaId,
                    ':',
                    subareaConfig.testeSubareaId,
                  );
                } catch (error) {
                  console.error('Erro ao buscar teste de subárea:', error);
                  // Em caso de erro, usa o ID padrão da configuração geral
                  setSubareaTesteId(config.testeSubareaId);
                }

                goToNextStep(2);
              }}
            />
          )}
          {/* Passo 3 - Teste de Especialidade/Subárea */}
          {currentStep === 2 && selectedAreaId && subareaTesteId && (
            <SubareaTestStepper
              testeId={subareaTesteId}
              usuarioId={usuario?.usuId ?? 0} // Usar ID do usuário autenticado, não da pessoa
              areaId={selectedAreaId}
              onFinish={() => goToNextStep(3)}
            />
          )}
          {currentStep === 2 && !subareaTesteId && (
            <div className="w-full flex flex-col flex-1 max-w-2xl mx-auto bg-white/90 p-10 border-t border-x border-zinc-100 min-h-[400px] justify-between">
              <div className="flex-1 flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Teste não disponível</h2>
                <p className="mb-4">O teste de especialidade não está configurado no sistema.</p>
                <p className="mb-8">Por favor, entre em contato com o administrador.</p>

                <button
                  onClick={() => navigateToStep(1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Voltar para resultados
                </button>
              </div>
            </div>
          )}
          {/* Passo 4 - Resultado do Teste de Especialidade/Subárea */}
          {currentStep === 3 && selectedAreaId && subareaTesteId && (
            <SubareaTestResultStepper
              testeId={subareaTesteId}
              usuarioId={usuario?.usuId ?? 0} // Usar ID do usuário autenticado, não da pessoa
              areaId={selectedAreaId}
              onBack={() => navigateToStep(2)}
              onNext={() => goToNextStep(4)}
            />
          )}
          {/* Passo 5 - Seleção Manual de Área/Subárea */}
          {currentStep === 4 && (
            <ManualSelectionStepper
              usuarioId={usuario?.usuId ?? 0}
              preselectedAreaId={selectedAreaId || undefined}
              onBack={() => navigateToStep(3)}
              onNext={() => goToNextStep(5)}
            />
          )}

          {/* Passo 6 - Perfil */}
          {currentStep === 5 && (
            <ProfileFormStepper
              onFinish={() => setShowStepper(false)}
              onBack={() => setCurrentStep(5)}
            />
          )}
        </Stepper>
      );
    }

    // Conteúdo da página home normal quando o usuário já tem perfil
    return (
      <div>
        <HeaderHome
          extra={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
        <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Título principal */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-800 dark:text-zinc-50 mb-3">
                Descubra seu Caminho Profissional
              </h1>
              <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
                Explore as possibilidades de carreira e encontre a profissão que combina com você.
              </p>
            </div>

            {/* Seção de cursos em destaque */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-6 flex items-center">
                <span className="mr-2">✨</span> Cursos em Destaque
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cursosDestaque.map((curso) => (
                  <Card
                    key={curso.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow dark:border-zinc-700"
                  >
                    <div className="p-5 flex flex-col h-full">
                      <div className="text-3xl mb-2">{curso.emoji}</div>
                      <h3 className="text-xl font-semibold mb-2 dark:text-zinc-50">
                        {curso.titulo}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-300 text-sm line-clamp-3 mb-4 flex-grow">
                        {curso.descricao.substring(0, 100)}...
                      </p>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full flex justify-between items-center"
                          >
                            <span>Saiba mais</span>
                            <ArrowRight size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] dark:bg-zinc-800 dark:border-zinc-700">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 dark:text-zinc-50">
                              <span className="text-2xl">{curso.emoji}</span> {curso.titulo}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <p className="text-zinc-700 dark:text-zinc-200 mb-4">
                              {curso.descricao}
                            </p>

                            <h4 className="font-medium text-zinc-800 dark:text-zinc-100 mb-2">
                              Áreas de atuação:
                            </h4>
                            <ul className="space-y-2">
                              {curso.areas.map((area, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2 mt-1 text-blue-500">•</span>
                                  <span className="dark:text-zinc-300">{area}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Seção de cursos filtrados pela categoria ativa */}
            <section>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
                  {categoriaAtiva === 'Todos' ? 'Todos os Cursos' : `Cursos de ${categoriaAtiva}`}
                </h2>

                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                  <Button
                    variant={categoriaAtiva === 'Todos' ? 'default' : 'outline'}
                    onClick={() => setCategoriaAtiva('Todos')}
                    size="sm"
                    className={`text-xs py-1 px-3 h-auto ${
                      categoriaAtiva !== 'Todos' ? 'dark:border-zinc-700 dark:text-zinc-300' : ''
                    }`}
                  >
                    Todos
                  </Button>

                  {Object.keys(categoriasCursos).map((categoria) => (
                    <Button
                      key={categoria}
                      variant={categoriaAtiva === categoria ? 'default' : 'outline'}
                      onClick={() => setCategoriaAtiva(categoria)}
                      size="sm"
                      className={`text-xs py-1 px-3 h-auto ${
                        categoriaAtiva !== categoria
                          ? 'dark:border-zinc-700 dark:text-zinc-300'
                          : ''
                      }`}
                    >
                      {categoria}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCursosFiltrados().map((curso) => (
                  <Card
                    key={curso.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow dark:border-zinc-700"
                  >
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-3xl">{curso.emoji}</span>
                        <h3 className="text-lg font-semibold dark:text-zinc-50">{curso.titulo}</h3>
                      </div>

                      <p className="text-zinc-600 dark:text-zinc-300 text-sm line-clamp-3 mb-4 flex-grow">
                        {curso.descricao.substring(0, 100)}...
                      </p>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full dark:border-zinc-700">
                            Explorar carreira
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="w-[95vw] sm:w-[90vw] md:w-[750px] max-h-[85vh] h-auto overflow-y-auto dark:bg-zinc-800 dark:border-zinc-700 p-3 px-4 sm:p-6 rounded-lg"
                          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}
                        >
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 dark:text-zinc-50">
                              <span className="text-2xl">{curso.emoji}</span> {curso.titulo}
                            </DialogTitle>
                          </DialogHeader>

                          <div className="mt-1 sm:mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
                            {/* Coluna da imagem */}
                            <div className="md:col-span-4">
                              <div className="rounded-lg overflow-hidden">
                                <Image
                                  src={curso.imagem}
                                  alt={curso.titulo}
                                  width={400}
                                  height={200}
                                  className="w-full h-[150px] sm:h-[200px] object-cover rounded-md"
                                  priority
                                />
                              </div>

                              <div className="mt-1 sm:mt-3">
                                <h4 className="font-medium text-zinc-800 dark:text-zinc-100 mb-1 sm:mb-2 text-xs sm:text-base">
                                  Áreas de atuação:
                                </h4>
                                <ul className="space-y-1">
                                  {curso.areas.map((area, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="mr-1 flex-shrink-0 text-blue-500 text-xs">
                                        •
                                      </span>
                                      <span className="dark:text-zinc-300 text-[10px] sm:text-sm leading-tight">
                                        {area}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Coluna de conteúdo */}
                            <div className="md:col-span-8">
                              <p className="text-zinc-700 dark:text-zinc-200 mb-2 sm:mb-4 text-xs sm:text-base leading-tight">
                                {curso.descricao}
                              </p>

                              {curso.carreiraInfo && (
                                <>
                                  <div className="mb-3 sm:mb-4">
                                    <h4 className="text-sm sm:text-md font-semibold text-blue-600 dark:text-blue-400 mb-0.5 sm:mb-1">
                                      Mercado de Trabalho
                                    </h4>
                                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-tight">
                                      {curso.carreiraInfo.mercadoTrabalho}
                                    </p>
                                  </div>

                                  <div className="mb-3 sm:mb-4">
                                    <h4 className="text-sm sm:text-md font-semibold text-blue-600 dark:text-blue-400 mb-0.5 sm:mb-1">
                                      Faixa Salarial
                                    </h4>
                                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-tight">
                                      {curso.carreiraInfo.salario}
                                    </p>
                                  </div>

                                  <div className="mb-2 sm:mb-4">
                                    <h4 className="text-sm sm:text-md font-semibold text-blue-600 dark:text-blue-400 mb-0.5 sm:mb-1">
                                      Habilidades Importantes
                                    </h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                                      {curso.carreiraInfo.habilidades.map((habilidade, index) => (
                                        <li key={index} className="flex items-center">
                                          <span className="text-blue-500 mr-1 flex-shrink-0">
                                            ✓
                                          </span>
                                          <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-tight">
                                            {habilidade}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="mt-3 sm:mt-4">
                                    <h4 className="text-sm sm:text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2 sm:mb-3">
                                      Trajetória Profissional
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-6 sm:gap-y-4">
                                      {curso.carreiraInfo.trajetoria.map((etapa, index) => (
                                        <div
                                          key={index}
                                          className="relative pl-5 border-l-2 border-blue-400"
                                        >
                                          {/* Círculo indicador na timeline */}
                                          <div className="absolute -left-[6px] sm:-left-[7px] top-0 h-2.5 sm:h-3 w-2.5 sm:w-3 rounded-full bg-blue-500 border-1 sm:border-2 border-blue-100 dark:border-zinc-800"></div>

                                          <h5 className="text-sm sm:text-base font-medium text-zinc-800 dark:text-zinc-100">
                                            {etapa.fase}
                                          </h5>
                                          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-tight">
                                            {etapa.descricao}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  };

  // Exibir um indicador de progresso na barra superior se estiver no stepper
  const renderProgressIndicator = () => {
    if (!showStepper) return null;

    const totalSteps = steps.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-1 bg-gray-200">
          <div
            className="h-1 bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      {/* Barra de progresso quando o stepper está ativo */}
      {renderProgressIndicator()}

      {/* Conteúdo principal (stepper ou conteúdo regular) */}
      {renderContent()}
    </ProtectedRoute>
  );
}
