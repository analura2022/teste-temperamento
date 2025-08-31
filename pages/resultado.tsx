import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Stripe from 'stripe';

const temperamentos = {
  colerico: {
    nome: "Colérico",
    descricao: "Você é um líder nato, determinado e orientado para resultados.",
    caracteristicas: [
      "Líder natural e decidido",
      "Orientado para objetivos e resultados",
      "Confiante e assertivo",
      "Gosta de desafios e competição",
      "Pode ser impaciente com detalhes"
    ],
    fortalezas: [
      "Capacidade de liderança",
      "Determinação e persistência",
      "Visão estratégica",
      "Coragem para tomar decisões difíceis"
    ],
    areas_desenvolvimento: [
      "Paciência com outros ritmos",
      "Escuta ativa",
      "Flexibilidade",
      "Controle da impulsividade"
    ],
    cor: "bg-red-500"
  },
  sanguineo: {
    nome: "Sanguíneo",
    descricao: "Você é otimista, sociável e cheio de energia positiva.",
    caracteristicas: [
      "Extrovertido e sociável",
      "Otimista e entusiástico",
      "Comunicativo e expressivo",
      "Adaptável e flexível",
      "Gosta de variedade e novidades"
    ],
    fortalezas: [
      "Habilidades sociais excepcionais",
      "Capacidade de motivar outros",
      "Criatividade e inovação",
      "Adaptabilidade a mudanças"
    ],
    areas_desenvolvimento: [
      "Foco e concentração",
      "Organização e planejamento",
      "Persistência em tarefas longas",
      "Atenção aos detalhes"
    ],
    cor: "bg-yellow-500"
  },
  flematico: {
    nome: "Flemático",
    descricao: "Você é calmo, equilibrado e um excelente mediador.",
    caracteristicas: [
      "Calmo e equilibrado",
      "Paciente e tolerante",
      "Bom ouvinte e mediador",
      "Confiável e leal",
      "Prefere estabilidade e harmonia"
    ],
    fortalezas: [
      "Estabilidade emocional",
      "Capacidade de mediação",
      "Lealdade e confiabilidade",
      "Paciência e perseverança"
    ],
    areas_desenvolvimento: [
      "Assertividade",
      "Iniciativa própria",
      "Expressão de opiniões",
      "Aceitação de mudanças"
    ],
    cor: "bg-green-500"
  },
  melancolico: {
    nome: "Melancólico",
    descricao: "Você é reflexivo, detalhista e busca a perfeição.",
    caracteristicas: [
      "Reflexivo e analítico",
      "Detalhista e perfeccionista",
      "Sensível e empático",
      "Criativo e artístico",
      "Prefere qualidade à quantidade"
    ],
    fortalezas: [
      "Atenção aos detalhes",
      "Capacidade analítica",
      "Sensibilidade e empatia",
      "Busca pela excelência"
    ],
    areas_desenvolvimento: [
      "Autoconfiança",
      "Aceitação de imperfeições",
      "Otimismo",
      "Flexibilidade com prazos"
    ],
    cor: "bg-blue-500"
  }
};

export default function Resultado() {
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    const verificarPagamento = async () => {
      if (!session_id) return;

      try {
        const response = await fetch(`/api/verify_payment?session_id=${session_id}`);
        const data = await response.json();
        
        if (data.success) {
          setResultado(data);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    verificarPagamento();
  }, [session_id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processando seu resultado...</p>
        </div>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Erro ao carregar resultado</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const temperamentoPrincipal = temperamentos[resultado.temperamento as keyof typeof temperamentos];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Seu Resultado
          </h1>
          <p className="text-lg text-gray-600">
            Análise completa do seu temperamento
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className={`${temperamentoPrincipal.cor} text-white p-8 text-center`}>
            <h2 className="text-3xl font-bold mb-2">
              {temperamentoPrincipal.nome}
            </h2>
            <p className="text-xl opacity-90">
              {temperamentoPrincipal.descricao}
            </p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Características Principais
                </h3>
                <ul className="space-y-2">
                  {temperamentoPrincipal.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{caracteristica}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Suas Fortalezas
                </h3>
                <ul className="space-y-2">
                  {temperamentoPrincipal.fortalezas.map((fortaleza, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{fortaleza}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Áreas para Desenvolvimento
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {temperamentoPrincipal.areas_desenvolvimento.map((area, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Distribuição das Respostas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {Object.entries(resultado.contagem).map(([tipo, count]) => (
                  <div key={tipo} className="p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">{count as number}</div>
                    <div className="text-sm text-gray-600 capitalize">{tipo}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <button 
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Fazer Novo Teste
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}