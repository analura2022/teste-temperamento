import { useRouter } from 'next/router';

export default function Cancelamento() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Pagamento Cancelado
          </h1>
          
          <p className="text-gray-600 mb-6">
            Parece que o pagamento não foi concluído. Não se preocupe, você pode tentar novamente quando quiser.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tentar Novamente
            </button>
            
            <p className="text-sm text-gray-500">
              Suas respostas não foram salvas. Você precisará responder o questionário novamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}