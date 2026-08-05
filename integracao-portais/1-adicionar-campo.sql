-- ============================================================================
-- Passo 1: adicionar o campo de marcação no Supabase
-- Rode isto no SQL Editor do Supabase (Dashboard > SQL Editor > New query)
-- ============================================================================

-- Adiciona a coluna booleana. Por padrão, nenhum imóvel é integrado
-- (você marca manualmente os que quiser exportar).
ALTER TABLE imoveis
  ADD COLUMN IF NOT EXISTS integrar_portais BOOLEAN NOT NULL DEFAULT false;

-- (Opcional) Campo para descrição longa do anúncio, se ainda não existir.
-- Os portais valorizam descrições completas. Se você já tem um campo de
-- descrição com outro nome, ignore esta linha e ajuste o index.ts.
ALTER TABLE imoveis
  ADD COLUMN IF NOT EXISTS descricao TEXT;

-- (Opcional) Campo de bairro, se ainda não existir — melhora o anúncio.
ALTER TABLE imoveis
  ADD COLUMN IF NOT EXISTS bairro TEXT;

-- Índice para o feed buscar rápido só os marcados.
CREATE INDEX IF NOT EXISTS idx_imoveis_integrar
  ON imoveis (integrar_portais)
  WHERE integrar_portais = true;
