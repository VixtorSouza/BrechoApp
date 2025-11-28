# 🚀 Guia da Equipe - BrechoApp

## 👥 Equipe de Desenvolvimento

### 🎯 Responsabilidades

- **Victor**: Backend completo, arquitetura, integrações, entrega final ao cliente
- **Brunelli**: Interface do usuário, telas de login, experiência visual
- **Gustavo**: Interface do usuário, telas de login, componentes visuais
- **Weslley**: Entrega, documentação, deploy e envio ao cliente

## 📋 Visão Geral

Aplicativo para gerenciamento de brechó da Eliane com React Native + Expo.

---

## 🛠 Setup do Ambiente

### Instalação

```bash
git clone https://github.com/vixtoru8/Brecho.git
cd Brecho/BrechoApp
npm install
npm start
```

### Windsurf + MCP

Configure o Windsurf com GitHub Copilot para assistência de IA.

---

## 🎯 Tarefas por Módulo

### 🔐 Autenticação

- [ ] Login/cadastro completo
- [ ] Recuperação de senha
- [ ] Perfil do usuário

**Arquivos:** `LoginScreen.tsx`, `AuthContext.tsx`

### 📦 Produtos + SQLite

- [ ] CRUD de produtos
- [ ] **SQLite para cache local**
- [ ] Sincronização offline/online
- [ ] Upload de imagens

**Arquivos:** `AddProductScreen.tsx`, `ProductContext.tsx`, `DatabaseService.ts`

### 🛒 Carrinho + SQLite

- [ ] Funcionalidade do carrinho
- [ ] **SQLite para persistência**
- [ ] Checkout básico
- [ ] Histórico de pedidos

**Arquivos:** `CartScreen.tsx`, `CartContext.tsx`, `CartDatabaseService.ts`

### 🔍 Catálogo + SQLite

- [ ] Listagem com filtros
- [ ] **SQLite para cache**
- [ ] Busca offline
- [ ] Favoritos

**Arquivos:** `CatalogScreen.tsx`, `SearchScreen.tsx`, `CatalogCacheService.ts`

### 👤 Perfil

- [ ] Dados pessoais
- [ ] Histórico de compras
- [ ] Configurações

**Arquivos:** `ProfileScreen.tsx`, `SettingsScreen.tsx`

---

## 🤖 Prompts para Windsurf

### Estrutura Base

```
[CONTEXTO] Descrição atual
[TAREFA] O que fazer
[REQUISITOS] Detalhes específicos
```

### Exemplo SQLite

```
"Preciso implementar SQLite para cache de produtos.
Crie DatabaseService.ts com:
- Configuração SQLite
- Tabela produtos (id, nome, preco, imagem)
- CRUD básico
- Sincronização com Supabase"

Contexto: Expo SQLite + TypeScript
Dependência: expo-sqlite
```

### Exemplo Tela

```
"Criar RegisterScreen.tsx com:
- Campos: nome, email, senha, confirmar
- Validação Yup
- Navegação pós-registro
- Estilo consistente"

Contexto: React Native + TypeScript
```

---

## 🗄️ Arquitetura de Dados

### Estrutura Híbrida

- **SQLite (Local)**: Cache, carrinho, favoritos, offline
- **Supabase (Online)**: Usuários, estoque, pedidos, sincronização

### Serviços SQLite

```bash
npm install expo-sqlite

src/services/
├── DatabaseService.ts      # Config SQLite
├── ProductSyncService.ts   # Sync produtos
├── CartDatabaseService.ts  # Carrinho local
└── CacheService.ts         # Cache inteligente
```

---

## 🔄 Fluxo de Trabalho

### Setup Diário

```bash
git pull origin main
npm install
npm start
```

### Branches

```bash
git checkout -b feature/nome-feature
# Desenvolver
git add .
git commit -m "feat: descrição"
git push origin feature/nome-feature
```

---

## 📋 Checklists

### ✅ Código

- [ ] Sem erros
- [ ] TypeScript ok
- [ ] Sem console.log()
- [ ] Testado em dispositivo

### ✅ Telas

- [ ] Responsiva
- [ ] Navegação funciona
- [ ] Loading states
- [ ] Tratamento de erros

---

## 🚨 Comandos de Emergência

```bash
# Resetar dependências
rm -rf node_modules package-lock.json
npm install

# Limpar cache Expo
expo start -c

# Resetar git
git reset --hard HEAD
git clean -fd
```

---

## 📊 Status do Projeto

- **Frontend**: ✅ Estrutura pronta
- **Navegação**: ✅ Implementada
- **Autenticação**: 🟡 Parcial
- **Produtos**: 🟡 Context criado
- **Carrinho**: 🟡 Iniciado
- **SQLite**: ❌ A implementar

---

## 🎯 Sprints

**Sprint 1** (2 sem):

- [ ] Autenticação completa
- [ ] CRUD produtos
- [ ] SQLite básico

**Sprint 2** (2 sem):

- [ ] Carrinho funcional
- [ ] Checkout
- [ ] Busca offline

**Sprint 3** (2 sem):

- [ ] Perfil completo
- [ ] Histórico
- [ ] Polimento

---

## 💡 Dicas Rápidas

1. **Use prompts específicos** para cada tarefa
2. **Teste offline** com SQLite
3. **Sincronize** apenas quando necessário
4. **Mantenha código limpo** e documentado
5. **Comunique-se** com a equipe

---

**Duvidas? Use os prompts de ajuda ou chame o líder!** 🚀
