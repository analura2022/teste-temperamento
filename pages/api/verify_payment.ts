import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

function calcularTemperamento(respostas: string[]) {
  const contagem = {
    colerico: 0,
    sanguineo: 0,
    flematico: 0,
    melancolico: 0
  };

  respostas.forEach(resposta => {
    if (resposta in contagem) {
      contagem[resposta as keyof typeof contagem]++;
    }
  });

  // Encontrar o temperamento dominante
  const temperamentoDominante = Object.entries(contagem).reduce((a, b) => 
    contagem[a[0] as keyof typeof contagem] > contagem[b[0] as keyof typeof contagem] ? a : b
  )[0];

  return {
    temperamento: temperamentoDominante,
    contagem
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { session_id } = req.query;

      if (!session_id || typeof session_id !== 'string') {
        return res.status(400).json({ error: 'Session ID é obrigatório' });
      }

      // Verificar a sessão no Stripe
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: 'Pagamento não confirmado' });
      }

      // Recuperar as respostas dos metadados
      const respostas = JSON.parse(session.metadata?.respostas || '[]');
      
      if (!respostas || respostas.length === 0) {
        return res.status(400).json({ error: 'Respostas não encontradas' });
      }

      // Calcular o temperamento
      const resultado = calcularTemperamento(respostas);

      res.status(200).json({
        success: true,
        ...resultado
      });
    } catch (err) {
      console.error('Erro ao verificar pagamento:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}