# 🔍 Troubleshooting: Áreas não aparecem no Perfil

## Problema

As áreas e subáreas do usuário não estão sendo exibidas na tela de perfil (`/home/perfil`).

## ✅ Checklist de Diagnóstico

### 1. **Verificar Console do Navegador (F12)**

Abra o console do navegador e procure por:

```
🔍 Carregando áreas do usuário... [ID]
✅ Áreas carregadas: [...]
```

**Se aparecer erro:**

- ❌ `401 Unauthorized` → Token expirado, faça login novamente
- ❌ `404 Not Found` → Endpoint não existe, verifique backend
- ❌ `500 Internal Server Error` → Erro no servidor, veja logs do backend

**Se aparecer array vazio `[]`:**

- O usuário não tem áreas cadastradas na tabela `USUARIOAREA`

### 2. **Verificar Logs do Backend**

No console do backend (Spring Boot), procure por:

```
INFO - Listando áreas do usuário ID: 123
INFO - Encontrados 0 vínculos de área para o usuário 123
```

Se encontrou 0 vínculos, o problema está no banco de dados.

### 3. **Verificar Banco de Dados**

Execute o script SQL em `docs/debug-areas-usuario.sql`:

```sql
-- Verificar vínculos do usuário
SELECT
    ua.USUA_ID,
    ua.USU_ID,
    ua.AREA_ID,
    a.AREA_DESCRICAO,
    ua.AREAS_ID,
    asub.AREAS_DESCRICAO
FROM USUARIOAREA ua
LEFT JOIN AREA a ON ua.AREA_ID = a.AREA_ID
LEFT JOIN AREASUB asub ON ua.AREAS_ID = asub.AREAS_ID
WHERE ua.USU_ID = 1; -- Substitua pelo ID do usuário
```

**Se não retornar nada:**

- O usuário não completou o teste vocacional
- Os vínculos não foram criados corretamente

### 4. **Testar Endpoint Diretamente**

Use curl ou Postman para testar:

```bash
curl -X GET http://localhost:8080/api/usuario-area/minhas-areas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Resposta esperada:**

```json
[
  {
    "usuareaId": 1,
    "usuarioId": 123,
    "area": {
      "areaId": 1,
      "areaDescricao": "Matemática"
    },
    "areaSub": {
      "areasId": 5,
      "areasDescricao": "Análise e Desenvolvimento de Sistemas"
    },
    "usuareaDatacadastro": "2025-10-19",
    "usuareaHoracadastro": "14:30:00"
  }
]
```

---

## 🛠️ Soluções Comuns

### ✅ Solução 1: Criar Vínculo Manualmente (Para Teste)

Se o usuário não tem áreas, crie um vínculo de teste:

```sql
-- Verificar ID do usuário
SELECT USU_ID, USU_EMAIL FROM USUARIO WHERE USU_EMAIL = 'seu@email.com';

-- Verificar áreas disponíveis
SELECT AREA_ID, AREA_DESCRICAO FROM AREA;

-- Verificar subáreas disponíveis
SELECT AREAS_ID, AREAS_DESCRICAO, AREA_ID FROM AREASUB;

-- Inserir vínculo
INSERT INTO USUARIOAREA (USU_ID, AREA_ID, AREAS_ID, USUA_DATACADASTRO, USUA_HORACADASTRO)
VALUES (
    1, -- ID do usuário
    1, -- ID da área (ex: Matemática)
    5, -- ID da subárea (ex: ADS)
    CURDATE(),
    CURTIME()
);
```

### ✅ Solução 2: Completar Teste Vocacional

O fluxo normal é:

1. Usuário faz login
2. Completa o teste vocacional
3. Sistema vincula automaticamente área/subárea
4. Perfil mostra as áreas

Para forçar vínculo através do teste:

1. Acesse `/home/teste-vocacional`
2. Complete o teste
3. Sistema criará vínculos automaticamente

### ✅ Solução 3: Verificar Permissões do Endpoint

Certifique-se de que o endpoint está acessível:

**No arquivo de configuração de segurança:**

```java
// O endpoint /api/usuario-area/** deve estar permitido para usuários autenticados
.requestMatchers("/api/usuario-area/**").authenticated()
```

### ✅ Solução 4: Limpar Cache e Recompilar

```bash
# Backend
cd e:/Projetos/RotaFuturo-API
./mvnw clean install
./mvnw spring-boot:run

# Frontend
cd e:/Projetos/RotaFuturo-Web
npm run dev
```

---

## 📊 Mensagens Visuais

### Caso 1: Carregando

```
┌────────────────────────┐
│ ⏳ Carregando...      │
└────────────────────────┘
```

### Caso 2: Sem Áreas (Novo Alerta Adicionado)

```
┌────────────────────────────────────────┐
│ ⚠️  Nenhuma área vinculada             │
│                                        │
│ Você ainda não tem áreas de interesse │
│ cadastradas. Complete um teste         │
│ vocacional para descobrir as melhores  │
│ áreas para você!                       │
└────────────────────────────────────────┘
```

### Caso 3: Com Áreas

```
┌────────────────────────────────────────┐
│ 📚 Áreas de Interesse                  │
├────────────────────────────────────────┤
│ 🎯 ÁREA                                │
│    Matemática                          │
│                                        │
│    SUBÁREA / CURSO                     │
│    Análise e Desenvolvimento de        │
│    Sistemas                            │
└────────────────────────────────────────┘
```

---

## 🔍 Debug Passo a Passo

### Passo 1: Verificar se o usuário está autenticado

```typescript
console.log('Usuário:', usuario);
console.log('Auth resolvido:', authResolved);
```

### Passo 2: Verificar chamada da API

```typescript
// Abrir Network tab (F12)
// Procurar por: GET /api/usuario-area/minhas-areas
// Status esperado: 200 OK
// Response: Array de UsuarioArea
```

### Passo 3: Verificar estado do componente

```typescript
console.log('Loading:', loadingAreas);
console.log('Áreas:', usuarioAreas);
console.log('Quantidade:', usuarioAreas.length);
```

### Passo 4: Verificar renderização

```typescript
// Se usuarioAreas.length > 0, a seção deve aparecer
// Se usuarioAreas.length === 0, mostra alerta amarelo
```

---

## 📝 Arquivos Modificados

### Backend

- ✅ `UsuarioAreaService.java` - Corrigido para buscar TODOS os vínculos
- ✅ Adicionados logs detalhados para debug

### Frontend

- ✅ `perfil/page.tsx` - Adicionados console.logs
- ✅ `perfil/page.tsx` - Adicionado alerta quando não há áreas

### Documentação

- ✅ `debug-areas-usuario.sql` - Scripts SQL para diagnóstico
- ✅ `troubleshooting-areas-perfil.md` - Este arquivo

---

## 🚀 Próximos Passos

1. **Abra o console do navegador** (F12)
2. **Recarregue a página** de perfil
3. **Procure pelos logs** com emoji 🔍 e ✅
4. **Execute os scripts SQL** se necessário
5. **Reporte o problema** com os logs encontrados

---

## 💡 Dicas

- O aviso amarelo "Nenhuma área vinculada" só aparece se `loadingAreas === false` e `usuarioAreas.length === 0`
- Se não aparecer nada (nem carregando, nem alerta), verifique se o `authResolved` é `true`
- Logs do backend aparecem no console onde o Spring Boot está rodando
- Logs do frontend aparecem no console do navegador (F12 → Console)

---

## ✅ Checklist Final

- [ ] Console do navegador mostra logs de carregamento?
- [ ] Endpoint retorna 200 OK?
- [ ] Array de áreas não está vazio?
- [ ] Banco de dados tem registros na USUARIOAREA?
- [ ] Token JWT está válido?
- [ ] Backend está rodando?
- [ ] Frontend está rodando?
- [ ] CORS está configurado corretamente?

Se todos os itens estiverem ✅ e ainda assim não aparecer, reporte com:

- Screenshot do console
- Logs do backend
- Resultado do SQL
- Resposta do endpoint
