# Configuração CORS para Backend Spring Boot

Este documento fornece instruções para configurar corretamente o CORS no backend Spring Boot para trabalhar com o frontend React/Next.js, especialmente para aceitar o cabeçalho `X-CSRF-Token` que foi implementado como parte das melhorias de segurança.

## Problema

O frontend está enviando um cabeçalho `X-CSRF-Token` nas requisições, mas o backend não está configurado para aceitá-lo, o que resulta em erros de CORS:

```
Access to fetch at 'http://192.168.2.50:8888/login/fazer-login' from origin 'http://localhost:3000' has been blocked by CORS policy: Request header field x-csrf-token is not allowed by Access-Control-Allow-Headers in preflight response.
```

## Solução

### 1. Configuração CORS no Spring Boot

Adicione ou atualize a seguinte configuração no backend:

```java
package br.com.rotafuturo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Permitir origens específicas ou usar * com cuidado em ambientes de desenvolvimento
        config.addAllowedOrigin("http://localhost:3000"); // Frontend Next.js local
        // Adicione outras origens conforme necessário (por exemplo, ambiente de produção)

        // Permitir métodos HTTP
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");

        // Permitir todos os cabeçalhos, incluindo o X-CSRF-Token
        config.addAllowedHeader("Content-Type");
        config.addAllowedHeader("Authorization");
        config.addAllowedHeader("X-CSRF-Token");

        // Permitir cookies
        config.setAllowCredentials(true);

        // Tempo de cache das configurações CORS
        config.setMaxAge(3600L);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### 2. Configuração Alternativa (usando WebSecurityConfigurerAdapter)

Se você estiver usando o Spring Security, também é possível configurar o CORS como parte da configuração de segurança:

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .cors().and()
        .csrf().disable()  // Desabilita o CSRF padrão do Spring, já que estamos implementando nossa própria solução
        .authorizeRequests()
        // Suas configurações de autorização aqui
        .anyRequest().authenticated()
        .and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

    // Adicione seu filtro JWT aqui
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization", "X-CSRF-Token"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 3. Implementação do Filtro CSRF no Backend

Para completar a segurança, você pode implementar um filtro que valida o token CSRF:

```java
@Component
public class CsrfTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Verificar apenas para métodos não seguros (POST, PUT, DELETE)
        String method = request.getMethod();
        if (Arrays.asList("POST", "PUT", "DELETE", "PATCH").contains(method)) {
            String csrfToken = request.getHeader("X-CSRF-Token");

            // Verificação simples de token - isso deve ser melhorado em produção
            // para uma validação mais robusta (por exemplo, comparando com token armazenado)
            if (csrfToken == null || csrfToken.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("CSRF token ausente ou inválido");
                return;
            }

            // Aqui você poderia implementar uma validação mais complexa do token
        }

        filterChain.doFilter(request, response);
    }
}
```

Adicione esse filtro à sua cadeia de filtros do Spring Security:

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        // Outras configurações
        .addFilterBefore(csrfTokenFilter, UsernamePasswordAuthenticationFilter.class);
}
```

## Após a Implementação

Depois de implementar essas mudanças no backend, você deve remover o comentário no código do frontend em `baseApiService.ts` para habilitar novamente o envio do token CSRF:

```typescript
// Adicionar cabeçalho anti-CSRF para métodos não seguros (POST, PUT, DELETE)
const method = options.method?.toUpperCase() || 'GET';
if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
  // Gerar um token CSRF baseado no timestamp atual
  // Em uma implementação real, isso seria validado no servidor
  const csrfToken = this.generateCsrfToken();
  headers['X-CSRF-Token'] = csrfToken;
}
```

## Nota sobre Ambientes de Produção

Para ambientes de produção, é altamente recomendável:

1. Não usar `addAllowedOrigin("*")`, mas sim listar explicitamente os domínios permitidos
2. Implementar uma validação mais robusta dos tokens CSRF
3. Considerar a utilização de um mecanismo de rotação de tokens
4. Configurar adequadamente as políticas de cache para os navegadores
