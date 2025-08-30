import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { respostas } = req.body;

      // Criar sessão de checkout do Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'Análise de Temperamento Personalizada',
                description: 'Descubra seu temperamento com base nas suas respostas',
              },
              unit_amount: 2997, // R$ 29,97 em centavos
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/resultado?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancelamento`,
        metadata: {
          respostas: JSON.stringify(respostas),
        },
        // Aplicar desconto com código GELLY
        discounts: [
          {
            coupon: 'GELLY', // Código de desconto atualizado
          },
        ],
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.error('Erro ao criar sessão de checkout:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}