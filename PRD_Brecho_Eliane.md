# PRD - Aplicativo Brechó da Eliane

## Visão Geral

Aplicativo móvel (Android e iOS) para o Brechó da Eliane, permitindo a gestão de estoque, catálogo de produtos e vendas online. O aplicativo será desenvolvido com React Native para garantir compatibilidade entre plataformas.

## Objetivos

1. Fornecer uma plataforma móvel para gerenciar o catálogo de produtos
2. Permitir o controle de estoque em tempo real
3. Oferecer uma experiência de compra intuitiva
4. Facilitar o gerenciamento de pedidos
5. Manter sincronização com a versão web existente

## Público-Alvo

- Clientes que desejam comprar roupas e acessórios em segunda mão
- Administradores do brechó que gerenciam o estoque e as vendas

## Requisitos Funcionais

### Módulo de Autenticação

- [x] Tela de login/cadastro
- [x] Integração com autenticação (Supabase + Mock)
- [x] Botão "Esqueceu sua senha?" (UI implementada)
- [x] Recuperação de senha
  - [x] Tela de recuperação de senha (ForgotPasswordScreen.tsx)
  - [x] Integração com resetPassword do AuthContext
  - [x] Validação de email para envio de link
  - [x] Notificação de email enviado
  - [x] Tela de redefinição de senha (ResetPasswordScreen.tsx)
  - [x] Validação de nova senha com confirmação
- [x] Perfil do usuário
  - [x] Estrutura básica da tela (ProfileScreen.tsx)
  - [x] Integração com dados do usuário do AuthContext
  - [x] Visualização de dados pessoais (nome, email)
  - [x] Edição de informações do perfil (placeholder implementado)
  - [x] Alteração de senha (updatePassword disponível)
  - [x] Histórico de pedidos (placeholder implementado)
  - [x] Endereços de entrega (placeholder implementado)
  - [x] Formas de pagamento salvas (placeholder implementado)
  - [x] Configurações de notificações (Switch implementado)
  - [x] Botão de logout (signOut implementado)
  - [x] Exclusão de conta (placeholder implementado)

### Módulo de Catálogo

- [x] Listagem de produtos com filtros
- [x] Visualização detalhada do produto
- [x] Categorização de produtos
- [x] Busca de produtos (SimpleSearchScreen.tsx)
- [x] Favoritos (SimpleFavoritesScreen.tsx)

### Módulo de Carrinho

- [x] Adicionar/remover itens
- [x] Ajustar quantidades
- [x] Cálculo automático de totais

### Módulo de Checkout

- [x] Formulário de entrega
- [x] Seleção de forma de pagamento
- [ ] Integração com gateways de pagamento
- [x] Confirmação de pedido

### Módulo de Gestão de Estoque (Admin)

- [x] Cadastro de novos produtos
- [x] Edição/Exclusão de produtos
- [x] Controle de estoque
- [ ] Relatórios de vendas
- [x] Gerenciamento básico de pedidos

### Módulo de Notificações

- [ ] Notificações push para atualizações de pedidos
- [ ] Alertas de promoções
- [ ] Lembretes de carrinho abandonado

## Requisitos Não-Funcionais

- Compatibilidade com Android 10+ e iOS 14+
- Tempo de carregamento inferior a 2 segundos
- Design responsivo para diferentes tamanhos de tela
- Segurança de dados (LGPD)
- Backup automático dos dados
- Suporte off-line para visualização de produtos

## Roadmap de Desenvolvimento

### Sprint 1: Configuração e Autenticação (2 semanas) ✅ CONCLUÍDA

- [x] Configuração do ambiente React Native
- [x] Estrutura básica do projeto
- [x] Tela de login/cadastro
- [x] Integração com autenticação
- [x] Navegação básica

### Sprint 2: Catálogo de Produtos (2 semanas) ✅ CONCLUÍDA

- [x] Listagem de produtos
- [x] Filtros básicos
- [x] Página de detalhes do produto
- [x] Carrossel de imagens
- [x] Carregamento paginado

### Sprint 3: Carrinho e Checkout (3 semanas)

- [ ] Adicionar ao carrinho
- [ ] Gerenciamento do carrinho
- [ ] Tela de checkout
- [ ] Formulário de entrega
- [ ] Integração com pagamentos

### Sprint 4: Área do Administrador (2 semanas) 🟡 EM ANDAMENTO

- [ ] Dashboard administrativo
- [x] CRUD de produtos
- [x] Gerenciamento básico de pedidos
- [x] Controle de estoque
- [ ] Relatórios básicos

### Próximos Passos: Sprint 3 - Carrinho e Checkout (3 semanas)

- [ ] Adicionar itens ao carrinho
- [ ] Gerenciamento do carrinho
- [ ] Tela de checkout
- [ ] Formulário de entrega
- [ ] Integração com pagamentos

### Sprint 5: Melhorias e Polimento (2 semanas)

- [ ] Testes de usabilidade
- [ ] Otimização de desempenho
- [ ] Ajustes de UI/UX
- [ ] Testes em dispositivos reais
- [ ] Preparação para lançamento

## Entregáveis

1. Código-fonte do aplicativo
2. Documentação da API
3. Guia de instalação
4. Manual do usuário
5. Política de privacidade e termos de uso

## Métricas de Sucesso

- Taxa de conversão de visitantes em compradores
- Tempo médio gasto no aplicativo
- Taxa de retenção de 30 dias
- Avaliação média na App Store/Play Store
- Volume de vendas gerado pelo aplicativo

## Considerações Técnicas

- Frontend: React Native
- Backend: API REST (existente no sistema web)
- Banco de Dados: Firebase Firestore
- Autenticação: Firebase Auth
- Armazenamento: Firebase Storage
- Pagamentos: Integração com Mercado Pago/PagSeguro
- Análise: Firebase Analytics

## Próximos Passos

1. Validação do PRD com as partes interessadas
2. Definição da stack técnica
3. Configuração do ambiente de desenvolvimento
4. Início do desenvolvimento na Sprint 1
