# Limites e proteção do envio em lote

Fonte oficial do Resend: https://resend.com/docs/api-reference/rate-limit

O limite padrão da API é de 10 requisições por segundo por equipe, compartilhado por todas as chaves da conta. Ao exceder, a API retorna HTTP 429. O Resend recomenda fila, redução de concorrência e respeito aos cabeçalhos `ratelimit-*` e `retry-after`.

Fonte oficial do Resend: https://resend.com/docs/knowledge-base/account-quotas-and-limits

No plano gratuito, o limite transacional informado é de 100 e-mails por dia e 3.000 por mês; e-mails enviados e recebidos contam para a cota, e múltiplos destinatários contam individualmente. A taxa padrão é 10 requisições por segundo por equipe. A API em lote aceita até 100 e-mails em uma chamada, mas isso é limite técnico, não recomendação de entregabilidade.

O Resend informa que a taxa de bounce deve permanecer abaixo de 4% e a taxa de spam abaixo de 0,08%; acima desses níveis, o envio pode ser pausado. A documentação recomenda enviar apenas a destinatários com consentimento, remover contatos inativos ou inválidos e oferecer uma forma clara de cancelamento.

Fonte oficial do Resend: https://resend.com/docs/api-reference/emails/send-batch-emails

A API de lote permite até 100 mensagens por requisição e até 50 destinatários no campo `to` de cada mensagem. Cada e-mail deve continuar individualizado para preservar privacidade; não será usado CC/BCC para uma lista de clientes.

Decisão inicial para o CRM: começar com lotes conservadores de até 20 destinatários por operação, com fila de 1 mensagem a cada 1–2 segundos, pausa automática em qualquer 429, bounce ou complaint, validação de e-mail, deduplicação, confirmação explícita, relatório de sucesso/falha e opção de cancelar. O limite de 20 é uma proteção operacional do CRM, não um limite oficial do Resend, e pode ser ajustado após observar métricas reais da conta.
