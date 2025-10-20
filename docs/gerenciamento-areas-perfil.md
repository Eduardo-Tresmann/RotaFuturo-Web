# Gerenciamento de Áreas no Perfil do Usuário

## 📋 Visão Geral

Implementado sistema completo para o usuário gerenciar suas áreas e subáreas de interesse diretamente no perfil, utilizando um accordion similar ao do teste vocacional.

## ✨ Funcionalidades Implementadas

### Frontend (Next.js/React)

#### 1. Nova Tab "Gerenciar Áreas"

- ✅ Adicionada nova opção na sidebar (desktop e mobile)
- ✅ Interface dedicada para visualizar e editar áreas
- ✅ Design consistente com o restante do perfil

#### 2. Visualização de Áreas Atuais

- ✅ Lista todas as áreas e subáreas vinculadas ao usuário
- ✅ Cards visuais com ícones e descrições
- ✅ Botão de remoção individual para cada área
- ✅ Estado vazio com mensagem amigável

#### 3. Accordion de Seleção

- ✅ Reutilizado componente `AreaSelectionAccordion` do teste vocacional
- ✅ Expansão/colapso de áreas para ver subáreas
- ✅ Seleção visual com feedback (CheckCircle)
- ✅ Descrições completas de cada área
- ✅ Grid de subáreas com hover states

#### 4. Gerenciamento de Áreas

- ✅ **Adicionar área**: Seleciona área e opcionalmente subárea via accordion
- ✅ **Remover área individual**: Botão X em cada card de área
- ✅ **Substituir áreas**: Remove todas e adiciona nova seleção
- ✅ **Validação**: Não permite salvar sem área selecionada
- ✅ **Loading states**: Feedback visual durante operações

### Backend (Spring Boot/Java)

#### 1. Service Layer (`UsuarioAreaService.java`)

```java
✅ listarAreasDoUsuario(Integer usuarioId) - Lista todas as áreas do usuário
✅ vincularArea(Integer usuarioId, Integer areaId, Integer areaSubId) - Vincula área/subárea
✅ desvincularArea(Integer usuareaId) - Remove vínculo específico
✅ desvincularTodasAreas(Integer usuarioId) - Remove todos os vínculos
```

**Dependências adicionadas:**

- `UsuarioRepository`
- `AreaRepository`
- `AreaSubRepository`

#### 2. Controller Layer (`UsuarioAreaController.java`)

**Endpoints criados:**

| Método   | Endpoint                         | Descrição                          |
| -------- | -------------------------------- | ---------------------------------- |
| `GET`    | `/api/usuario-area/minhas-areas` | Lista áreas do usuário autenticado |
| `POST`   | `/api/usuario-area/vincular`     | Vincula área/subárea ao usuário    |
| `DELETE` | `/api/usuario-area/{usuareaId}`  | Remove vínculo específico          |
| `DELETE` | `/api/usuario-area/todas`        | Remove todos os vínculos           |

**Request Body para vincular:**

```json
{
  "areaId": 1,
  "areaSubId": 5 // opcional
}
```

#### 3. Frontend Service (`UsuarioAreaService.ts`)

```typescript
✅ listarMinhasAreas() - Lista áreas do usuário
✅ vincularArea(areaId, areaSubId?) - Vincula área/subárea
✅ desvincularArea(usuareaId) - Remove vínculo
✅ desvincularTodasAreas() - Remove todos os vínculos
```

## 🎨 Interface do Usuário

### Layout da Tab "Gerenciar Áreas"

```
┌─────────────────────────────────────────────────────┐
│ 📚 Gerenciar Áreas de Interesse                    │
│ Selecione ou altere suas áreas de interesse        │
├─────────────────────────────────────────────────────┤
│                                                      │
│ 🎯 Suas Áreas Atuais (se existirem)                │
│ ┌───────────────────────────────────────────┐      │
│ │ Área: Sistemas de Informação        [X]   │      │
│ │ Subárea: Desenvolvimento Web              │      │
│ └───────────────────────────────────────────┘      │
│                                                      │
│ ➕ Adicionar Nova Área                              │
│ ┌───────────────────────────────────────────┐      │
│ │ > 📖 Sistemas de Informação          ✓    │      │
│ │   Descrição da área...                    │      │
│ │   📚 Subáreas disponíveis:                │      │
│ │   ┌─────────────────────────────┐         │      │
│ │   │ 🎓 Desenvolvimento Web   ✓  │         │      │
│ │   └─────────────────────────────┘         │      │
│ │   [Selecionar esta Área]                  │      │
│ └───────────────────────────────────────────┘      │
│                                                      │
│                    [Cancelar] [➕ Adicionar Área]   │
└─────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Uso

### 1. Adicionar Nova Área

1. Usuário acessa "Gerenciar Áreas" no menu
2. Expande uma área no accordion
3. Opcionalmente seleciona uma subárea
4. Clica em "Adicionar Área"
5. Sistema remove áreas antigas e adiciona nova
6. Notificação de sucesso e retorno ao perfil

### 2. Remover Área Individual

1. Usuário visualiza suas áreas atuais
2. Clica no botão X de uma área específica
3. Área é removida imediatamente
4. Lista atualizada automaticamente

## 🎯 Estados da Interface

### Loading States

- ⏳ Carregando áreas do usuário
- ⏳ Carregando áreas disponíveis
- ⏳ Salvando nova área
- ⏳ Removendo área

### Empty States

- 📭 Nenhuma área vinculada (em "Suas Áreas Atuais")
- ⚠️ Alerta amarelo no perfil quando não há áreas

### Success/Error States

- ✅ Área adicionada com sucesso
- ✅ Área removida com sucesso
- ❌ Erro ao carregar áreas
- ❌ Erro ao salvar área
- ⚠️ Validação: selecione uma área

## 📦 Arquivos Modificados/Criados

### Backend

- ✅ `UsuarioAreaService.java` - Novos métodos de gerenciamento
- ✅ `UsuarioAreaController.java` - Novos endpoints REST

### Frontend

- ✅ `UsuarioAreaService.ts` - Novos métodos de API
- ✅ `src/app/home/perfil/page.tsx` - Nova tab e lógica
- ✅ Reutilizado `AreaSelectionAccordion` existente

### Documentação

- ✅ `gerenciamento-areas-perfil.md` - Este arquivo

## 🔐 Segurança

- ✅ Todos os endpoints autenticados via JWT
- ✅ SecurityContextHolder valida usuário autenticado
- ✅ Apenas o próprio usuário pode gerenciar suas áreas
- ✅ Validação de IDs de área e subárea no backend

## 🚀 Melhorias Futuras (Opcional)

- [ ] Permitir múltiplas áreas vinculadas simultaneamente
- [ ] Ordenação de áreas por preferência
- [ ] Histórico de mudanças de áreas
- [ ] Sugestões baseadas em testes vocacionais
- [ ] Pesquisa/filtro de áreas no accordion
- [ ] Drag-and-drop para reordenar áreas

## 📝 Notas Técnicas

### Estratégia de Substituição

Atualmente, ao adicionar uma nova área:

1. Remove TODAS as áreas antigas (`desvincularTodasAreas`)
2. Adiciona a nova área selecionada (`vincularArea`)

Isso garante que o usuário tenha apenas uma área principal. Para permitir múltiplas áreas, remover o passo 1.

### Integração com AreaSelectionAccordion

O componente já existente foi perfeitamente integrado, mantendo:

- Props de seleção (`selectedAreaId`, `selectedSubareaId`)
- Callbacks (`onSelectArea`, `onSelectSubarea`)
- Estilos e comportamentos originais
- Descrições e ícones das áreas

## ✅ Checklist de Implementação

- [x] Backend: Service methods
- [x] Backend: Controller endpoints
- [x] Backend: Validação e segurança
- [x] Frontend: Service methods
- [x] Frontend: UI components
- [x] Frontend: State management
- [x] Frontend: Loading/error handling
- [x] Frontend: Responsividade (mobile/desktop)
- [x] Integração completa
- [x] Testes manuais
- [x] Documentação

---

**Data de Implementação:** 19/10/2025  
**Desenvolvedor:** Cristiano Lopes  
**Status:** ✅ Completo e Funcional
