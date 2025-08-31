import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const perguntas = [
  { 
    texto: "Quando estou em grupo, geralmente:", 
    opcoes: [
      { texto: "Tomo a liderança naturalmente", tipo: "colerico" },
      { texto: "Sou animado e gosto de conversar", tipo: "sanguineo" },
      { texto: "Prefiro ouvir e observar", tipo: "flematico" },
      { texto: "Sou reservado e fico desconfortável com muita gente", tipo: "melancolico" }
    ]
  },
  { 
    texto: "Diante de um problema, eu:", 
    opcoes: [
      { texto: "Ajo rapidamente para resolver", tipo: "colerico" },
      { texto: "Procuro uma solução criativa e divertida", tipo: "sanguineo" },
      { texto: "Analiso calmamente todas as opções", tipo: "flematico" },
      { texto: "Reflito profundamente antes de agir", tipo: "melancolico" }
    ]
  },
  { 
    texto: "Meu ritmo de trabalho é:", 
    opcoes: [
      { texto: "Rápido e eficiente", tipo: "colerico" },
      { texto: "Energético com pausas para socializar", tipo: "sanguineo" },
      { texto: "Constante e metodico", tipo: "flematico" },
      { texto: "Cuidadoso e detalhista", tipo: "melancolico" }
    ]
  },
  { 
    texto: "Em situações de estresse, eu:", 
    opcoes: [
      { texto: "Fico impaciente e quero resolver logo", tipo: "colerico" },
      { texto: "Procuro distração ou converso com alguém", tipo: "sanguineo" },
      { texto: "Mantenho a calma e sigo em frente", tipo: "flematico" },
      { texto: "Fico ansioso e penso demais", tipo: "melancolico" }
    ]
  },
  { 
    texto: "Minha forma de comunicação é:", 
    opcoes: [
      { texto: "Direta e objetiva", tipo: "colerico" },
      { texto: "Expressiva e entusiástica", tipo: "sanguineo" },
      { texto: "Calma e diplomática", tipo: "flematico" },
      { texto: "Cuidadosa e pensativa", tipo: "melancolico" }
    ]
  }
];

export default function Home() {
  const [respostas, setRespostas] = useState<string[]>(Array(perguntas.length).fill(""));
  const [loading, setLoading] = useState(false);

  const handleResposta = (index: number, tipo: string) => {
    const novasRespostas = [...respostas];
    novasRespostas[index] = tipo;
    setRespostas(novasRespostas);
  };

  const todasRespondidas = respostas.every(resposta => resposta !== "");

  const iniciarPagamento = async () => {
    if (!todasRespondidas) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ respostas }),
      });
      
      const { sessionId } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Erro ao iniciar pagamento:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Descubra Seu Temperamento
          </h1>
          <p className="text-lg text-gray-600">
            Responda às perguntas abaixo para descobrir seu perfil de temperamento
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {perguntas.map((pergunta, index) => (
            <div key={index} className="mb-8 last:mb-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {index + 1}. {pergunta.texto}
              </h3>
              <div className="space-y-3">
                {pergunta.opcoes.map((opcao, i) => (
                  <label 
                    key={i} 
                    className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`pergunta-${index}`}
                      value={opcao.tipo}
                      onChange={() => handleResposta(index, opcao.tipo)}
                      checked={respostas[index] === opcao.tipo}
                      className="mt-1 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700">{opcao.texto}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <button
                onClick={iniciarPagamento}
                disabled={!todasRespondidas || loading}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                  todasRespondidas && !loading
                    ? "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Processando..." : "Ver Meu Resultado - R$ 29,97"}
              </button>
              {!todasRespondidas && (
                <p className="text-sm text-gray-500 mt-2">
                  Responda todas as perguntas para continuar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}