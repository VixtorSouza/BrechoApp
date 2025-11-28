# PRD - Aplicativo Brechó da Eliane

## Visão Geral

Aplicativo móvel (Android e iOS) para o Brechó da Eliane, permitindo gestão de estoque, catálogo de produtos e vendas online.

## Equipe de Desenvolvimento

### 👥 Responsabilidades

- **Victor**: Backend completo, arquitetura, integrações, entrega final ao cliente
- **Brunelli**: Interface do usuário, telas de login, experiência visual
- **Gustavo**: Interface do usuário, telas de login, componentes visuais
- **Weslley**: Entrega, documentação, deploy e envio ao cliente

## Status Atual do Projeto

### ✅ IMPLEMENTADO E FUNCIONAL

#### Gestão de Estoque (Admin) - COMPLETO

- [x] **Tela de Estoque**: SimpleStockScreen implementada e funcional
- [x] **Listagem**: Mostra 8 produtos mock com informações completas
- [x] **Adicionar Produtos**: Formulário completo com validação funcionando
- [x] **Editar Produtos**: Modal de edição com dados preenchidos
- [x] **Excluir Produtos**: Confirmação e exclusão funcionando
- [x] **Persistência**: AsyncStorage salvando e recuperando dados
- [x] **Validação**: Todos os campos obrigatórios validados
- [x] **Interface**: Cards com status de estoque (verde/vermelho)
- [ ] **Upload de Imagens**: Componente existe mas upload real não funciona

#### Navegação e Estrutura

- [x] **Navegação por Tabs**: 5 abas principais (Início, Buscar, Carrinho, Favoritos, Estoque)
- [x] **Stack Navigation**: Navegação entre telas com headers personalizados
- [x] **Tema Visual**: Cores roxas (#8b5cf6) e design consistente

#### Catálogo de Produtos

- [x] **Listagem**: Catálogo com produtos mock funcionais
- [x] **Busca**: Barra de pesquisa que filtra por nome e tipo
- [x] **Cards**: ProductCard com imagem, nome, preço
- [x] **Detalhes**: ProductDetailScreen com informações completas

#### Carrinho de Compras

- [x] **Adicionar/Remover**: Funcionalidade completa no carrinho
- [x] **Ajustar Quantidades**: Incremento/decremento funcionando
- [x] **Cálculo de Totais**: Soma automática dos valores
- [x] **Persistência**: Carrinho mantido com AsyncStorage

### 🟡 PARCIALMENTE IMPLEMENTADO

#### Upload de Imagens

- [x] **Componente**: ImageUpload implementado
- [x] **Placeholder**: Usa Picsum se não selecionar imagem
- [x] **Upload Real**: Com integração com Supabase Storage

#### Autenticação

- [x] **Estrutura**: AuthContext configurado
- [x] **Telas**: Login, registro, recuperação criadas
- [x] **Conexão Real**: Firebase configurado

### ❌ NÃO IMPLEMENTADO

- [ ] **SQLite**: Banco local não implementado
- [ ] **Supabase**: Sem conexão real com backend
- [ ] **Pagamentos**: Sem integração com gateway
- [ ] **Perfil do Usuário**: Sem gestão real

---

**Status Geral: MVP funcional com estoque completo implementado**
