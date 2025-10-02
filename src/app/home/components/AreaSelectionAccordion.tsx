'use client';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  GraduationCap,
  BookOpenCheck,
  TrendingUp,
  BarChart4,
  ThumbsUp,
  CheckCircle,
  Settings,
  Zap,
} from 'lucide-react';
import { AreaSub } from '@/types/areasub';
import { Area } from '@/types/area';
const areaIcons: Record<string, React.ReactNode> = {
  Agronomia: <BookOpen className="w-5 h-5 mr-2 dark:text-gray-300" />,
  Biomedicina: <Zap className="w-5 h-5 mr-2 dark:text-gray-300" />,
  Enfermagem: <BookOpenCheck className="w-5 h-5 mr-2 dark:text-gray-300" />,
  'Engenharia Mecânica': <Settings className="w-5 h-5 mr-2 dark:text-gray-300" />,
  'Sistemas de Informação': <TrendingUp className="w-5 h-5 mr-2 dark:text-gray-300" />,
  'Análise e Desenvolvimento de Sistemas': (
    <BarChart4 className="w-5 h-5 mr-2 dark:text-gray-300" />
  ),
  default: <GraduationCap className="w-5 h-5 mr-2 dark:text-gray-300" />,
};
const getAreaIcon = (areaName: string) => {
  return areaIcons[areaName] || areaIcons['default'];
};
const areaDescriptions: Record<string, string> = {
  Agronomia:
    'O curso de Agronomia forma profissionais que unem ciência, tecnologia e inovação para garantir que o mundo tenha alimentos de qualidade, produzidos de forma sustentável e responsável.',
  Biomedicina:
    'A Biomedicina é um curso para quem gosta de ciência, laboratório e quer fazer parte da busca por respostas que transformam a saúde do mundo.',
  Enfermagem:
    'Ser enfermeiro é estar presente nos momentos mais importantes da vida das pessoas. É cuidar, acolher e salvar vidas todos os dias, unindo técnica, empatia e dedicação.',
  'Engenharia Mecânica':
    'A Engenharia Mecânica projeta, desenvolve e melhora sistemas que movimentam indústrias e transformam o mundo.',
  Fonoaudiologia:
    'A Fonoaudiologia forma profissionais que cuidam da fala, da voz, da audição e até da deglutição, ajudando pessoas a se expressarem.',
  Logística:
    'A Logística é a área que garante que produtos e serviços cheguem ao destino certo, no tempo certo.',
  Nutrição:
    'O curso de Nutrição forma profissionais capazes de transformar hábitos, prevenir doenças e melhorar a qualidade de vida das pessoas através da alimentação.',
  'Sistemas de Informação':
    'O curso de Sistemas de Informação forma profissionais capazes de integrar tecnologia, gestão e estratégia para transformar informações em soluções inteligentes.',
  'Análise e Desenvolvimento de Sistemas':
    'ADS foca no desenvolvimento prático de soluções tecnológicas que usamos no dia a dia, como aplicativos, softwares e sistemas digitais.',
  Direito:
    'O curso de Direito prepara profissionais para defender direitos, interpretar leis e atuar em grandes decisões que impactam a sociedade.',
  'Engenharia Civil':
    'É uma das engenharias mais tradicionais e indispensáveis, responsável por projetar e executar obras que mudam o espaço urbano e rural.',
  'Estética e Cosmética':
    'O curso de Estética e Cosmética vai muito além de técnicas: ele une saúde, bem-estar e autoestima.',
  'Gestão Ambiental':
    'O curso de Gestão Ambiental forma profissionais preparados para equilibrar desenvolvimento e sustentabilidade.',
  Medicina:
    'Ser médico é dedicar-se a salvar vidas, cuidar da saúde e estar presente nos momentos mais delicados da vida das pessoas.',
  Odontologia:
    'A Odontologia é a ciência que cuida da saúde da boca e contribui para a saúde geral do corpo.',
  'Terapia Ocupacional':
    'O terapeuta ocupacional atua com criatividade e empatia, promovendo inclusão e qualidade de vida.',
  'Arquitetura e Urbanismo':
    'O curso une arte, criatividade e técnica para projetar ambientes que inspiram, acolhem e melhoram a vida das pessoas.',
  'Educação Física':
    'O curso de Educação Física forma profissionais que promovem saúde, bem-estar e desempenho por meio da atividade física.',
  'Engenharia Elétrica':
    'O engenheiro elétrico trabalha em projetos que vão da eletrônica ao desenvolvimento de energias renováveis.',
  Fisioterapia:
    'É uma profissão que une ciência, saúde e cuidado humano em cada atendimento para restaurar movimentos e devolver qualidade de vida.',
  'Gestão de Recursos Humanos':
    'A Gestão de RH forma profissionais que desenvolvem talentos, constroem equipes de sucesso e criam ambientes de trabalho saudáveis.',
  'Medicina Veterinária':
    'O curso de Medicina Veterinária prepara profissionais para proteger a vida animal, garantir o bem-estar e colaborar com a saúde humana.',
  Psicologia:
    'O curso de Psicologia forma profissionais que ajudam pessoas a lidarem com emoções, comportamentos e relações, promovendo equilíbrio e bem-estar.',
  default: 'Explore mais sobre esta área e descubra oportunidades profissionais interessantes.',
};
const getAreaDescription = (areaName: string) => {
  return areaDescriptions[areaName] || areaDescriptions['default'];
};
interface AreaSelectionAccordionProps {
  areas: Area[];
  subareas: AreaSub[];
  onSelectArea: (areaId: number) => void;
  onSelectSubarea: (subareaId: number) => void;
  selectedAreaId?: number;
  selectedSubareaId?: number;
}
const AreaSelectionAccordion: React.FC<AreaSelectionAccordionProps> = ({
  areas,
  subareas,
  onSelectArea,
  onSelectSubarea,
  selectedAreaId,
  selectedSubareaId,
}) => {
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const getSubareasByAreaId = (areaId: number) => {
    return subareas.filter((subarea) => subarea.areaId === areaId);
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">
        Escolha sua Área de Interesse
      </h2>
      <p className="text-center mb-6 text-muted-foreground dark:text-gray-400">
        Caso não esteja satisfeito com os resultados automáticos, você pode escolher manualmente uma
        área e subárea de seu interesse.
      </p>
      <Accordion
        type="single"
        collapsible
        value={expandedArea || undefined}
        onValueChange={(value) => {
          setExpandedArea(value);
          const areaId = parseInt(value.split('-')[1]);
          if (!isNaN(areaId)) {
            onSelectArea(areaId);
          }
        }}
        className="w-full"
      >
        {areas.map((area) => (
          <AccordionItem
            key={`area-${area.areaId}`}
            value={`area-${area.areaId}`}
            className={`mb-4 border rounded-lg ${
              selectedAreaId === area.areaId
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-border dark:border-zinc-700'
            }`}
          >
            <AccordionTrigger className="px-3 sm:px-4 py-3 hover:no-underline">
              <div className="flex items-center truncate">
                <span className="flex-shrink-0 mr-2 dark:text-gray-400">
                  {getAreaIcon(area.areaDescricao)}
                </span>
                <span className="font-semibold text-sm sm:text-base truncate dark:text-gray-200">
                  {area.areaDescricao}
                </span>
                {selectedAreaId === area.areaId && (
                  <CheckCircle className="w-4 h-4 ml-2 text-primary dark:text-blue-400 flex-shrink-0" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 sm:px-4">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                  {getAreaDescription(area.areaDescricao)}
                </p>
                <h4 className="font-medium mt-3 sm:mt-4 text-sm sm:text-base dark:text-gray-200">
                  Subáreas disponíveis:
                </h4>
                <div className="grid grid-cols-1 gap-2 mt-1 sm:mt-2">
                  {getSubareasByAreaId(area.areaId).map((subarea) => (
                    <Card
                      key={subarea.areasId}
                      className={`cursor-pointer hover:border-primary transition-colors ${
                        selectedSubareaId === subarea.areasId
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'dark:border-zinc-700'
                      }`}
                      onClick={() => onSelectSubarea(subarea.areasId)}
                    >
                      <CardContent className="p-2 sm:p-3 flex items-center justify-between">
                        <div className="flex items-center truncate">
                          <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-muted-foreground dark:text-gray-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate dark:text-gray-300">
                            {subarea.areasDescricao}
                          </span>
                        </div>
                        {selectedSubareaId === subarea.areasId && (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary dark:text-blue-400 flex-shrink-0 ml-1" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="pt-1 sm:pt-2">
                  <Button
                    onClick={() => onSelectArea(area.areaId)}
                    variant={selectedAreaId === area.areaId ? 'secondary' : 'outline'}
                    className={`w-full text-xs sm:text-sm py-1 sm:py-2 h-auto dark:border-zinc-600 ${
                      selectedAreaId === area.areaId
                        ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 font-medium'
                        : 'dark:hover:bg-zinc-700 dark:text-gray-200'
                    }`}
                    size="sm"
                  >
                    {selectedAreaId === area.areaId ? 'Limpar Seleção' : 'Selecionar esta Área'}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
export default AreaSelectionAccordion;
