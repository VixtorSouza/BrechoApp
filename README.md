# BrechoApp

Aplicativo mobile para gerenciamento de brechó, desenvolvido para a Eliane Brechós.

## 👥 Equipe e Responsabilidades

### 🎯 Funções

- **Victor**: Backend completo, arquitetura, integrações, entrega final ao cliente
- **Brunelli**: Interface do usuário, telas de login, experiência visual
- **Gustavo**: Interface do usuário, telas de login, componentes visuais
- **Weslley**: Entrega, documentação, deploy e envio ao cliente

## 📋 Sobre o Projeto

O **BrechoApp** é uma solução completa para gerenciamento de brechó, permitindo cadastrar produtos, gerenciar estoque, controlar vendas e oferecer uma experiência de compra intuitiva para os clientes. O aplicativo foi desenvolvido pensando em simplicidade e eficiência para pequenos e médios vendedores de roupas usadas.

## 🎯 Objetivo

- **Digitalizar o processo** de venda em brechós
- **Facilitar o gerenciamento** de produtos e estoque
- **Oferecer experiência moderna** para clientes
- **Automatizar o controle** de vendas e favoritos
- **Suportar múltiplas plataformas** (iOS, Android, Web)

## 🛠 Tecnologias Utilizadas

### Frontend Mobile

- **React Native** (0.81.5) - Framework principal
- **Expo** (54.0.25) - Plataforma de desenvolvimento
- **TypeScript** - Tipagem e segurança

### Navegação & UI

- **React Navigation** (7.x) - Navegação entre telas
- **React Native Gesture Handler** - Gestos e animações
- **React Native Reanimated** - Animações fluidas
- **Expo Vector Icons** - Ícones

### Estado & Dados

- **React Hook Form** - Formulários e validação
- **Async Storage** - Armazenamento local
- **Supabase** - Backend e banco de dados
- **Context API** - Gerenciamento de estado

### Validação & Utilitários

- **Yup** - Validação de formulários
- **Expo Image Picker** - Seleção de imagens
- **Expo Secure Store** - Armazenamento seguro

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js (versão 18+)
- Expo CLI instalado globalmente
- Dispositivo iOS/Android ou Expo Go

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/vixtoru8/Brecho.git
cd Brecho/BrechoApp

# Instalar dependências
npm install

# Iniciar o projeto
npm start
```

### Comandos Disponíveis

```bash
npm start          # Iniciar servidor de desenvolvimento
npm run android    # Executar no Android
npm run ios        # Executar no iOS
npm run web        # Executar no navegador
```

### Variáveis de Ambiente

Configure as variáveis do Supabase no arquivo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📁 Estrutura do Projeto

```
BrechoApp/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Contextos de estado global
│   ├── navigation/     # Configuração de navegação
│   └── screens/        # Telas do aplicativo
├── assets/            # Imagens e ícones
├── App.tsx           # Componente principal
└── package.json      # Dependências e scripts
```

## 🎨 Telas Principais

- **HomeScreen** - Tela inicial com boas-vindas
- **CatalogScreen** - Catálogo de produtos
- **ProductDetailScreen** - Detalhes do produto
- **AddProductScreen** - Cadastro de novos produtos
- **CartScreen** - Carrinho de compras
- **FavoritesScreen** - Produtos favoritados
- **ProfileScreen** - Perfil do usuário
- **SearchScreen** - Busca de produtos

## 🔧 Onde Desenvolver

### Para Continuar o Desenvolvimento:

1. **Telas e Componentes**

   - `src/screens/` - Adicionar novas telas
   - `src/components/` - Criar componentes reutilizáveis

2. **Navegação**

   - `src/navigation/SimpleAppNavigator.tsx` - Configurar rotas

3. **Estado Global**

   - `src/contexts/ProductContext.tsx` - Gerenciar produtos
   - `src/contexts/AuthContext.tsx` - Autenticação

4. **Estilização**

   - Adicionar styles em cada componente
   - Considerar tema global em `src/styles/`

5. **API e Backend**
   - Configurar integração com Supabase
   - Criar serviços em `src/services/`


## 📱 Licença

Este projeto é privado e desenvolvido exclusivamente para a Eliane Brechós.

---

"
**Desenvolvido com ❤️ usando React Native + Expo**
