# Minha Plataforma de Filmes

Minha Plataforma de Filmes é um site inspirado na Netflix que permite aos usuários buscar filmes e séries, categorizá-los e acompanhar o progresso de visualização. O site também exibe estatísticas sobre o tempo assistido e o progresso das séries.

## Funcionalidades

- **Busca de Filmes e Séries:** Permite buscar filmes e séries usando a API do The Movie Database (TMDb).
- **Categorização:** Os usuários podem categorizar filmes e séries em "Filmes Assistidos", "Filmes para Assistir", "Séries em Andamento" e "Séries Assistidas".
- **Progresso de Séries:** Permite marcar episódios assistidos e exibe o progresso da série em um gráfico.
- **Estatísticas:** Exibe gráficos com o tempo total assistido em filmes e séries.
- **Persistência de Dados:** Os dados são salvos no `localStorage` do navegador para que as informações sejam mantidas entre sessões.
- **Detalhes dos Episódios:** Exibe detalhes dos episódios ao passar o mouse sobre eles.

## Tecnologias Utilizadas

- **HTML:** Estrutura do site.
- **CSS:** Estilização do site.
- **JavaScript:** Funcionalidades do site.
- **Chart.js:** Biblioteca para criação de gráficos.
- **TMDb API:** API para busca de filmes e séries.

## Como Usar

1. **Buscar Filmes e Séries:**
   - Digite o nome do filme ou série na barra de busca e clique em "Buscar".
   - Os resultados da busca serão exibidos na seção "Resultados da Busca".

2. **Categorizar Filmes e Séries:**
   - Clique em um filme ou série nos resultados da busca.
   - Escolha a categoria desejada (Filmes Assistidos, Filmes para Assistir, Séries em Andamento, Séries Assistidas).

3. **Marcar Episódios Assistidos:**
   - Clique em uma série na categoria "Séries em Andamento".
   - Marque os episódios assistidos ou clique em "Marcar Temporada como Assistida" para marcar todos os episódios da temporada.

4. **Ver Estatísticas:**
   - Acesse a seção "Estatísticas" para ver gráficos com o progresso das séries e o tempo total assistido.

## Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/minha-plataforma-de-filmes.git
```

2. Navegue até o diretório do projeto:
```bash
cd minha-plataforma-de-filmes
```

3. Abra o arquivo `index.html` no seu navegador para visualizar o site.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma nova branch com a sua feature: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'Minha nova feature'`
4. Faça um push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Abrir o Projeto no Navegador

Para abrir o projeto no navegador, siga os passos abaixo:

1. Navegue até o diretório do projeto:
```bash
cd minha-plataforma-de-filmes
```
2. Abra o arquivo `index.html` no seu navegador preferido. Você pode fazer isso clicando duas vezes no arquivo ou arrastando-o para uma janela do navegador.

## Implantação no Vercel

Para implantar o projeto no Vercel, siga os passos abaixo:

1. Crie uma conta no [Vercel](https://vercel.com/) se ainda não tiver uma.
2. Instale a Vercel CLI globalmente:
```bash
npm install -g vercel
```

3. Faça login na Vercel CLI:
```bash
vercel login
```

4. No diretório do projeto, execute o comando para implantar:
```bash
vercel
```

5. Siga as instruções no terminal para configurar e implantar o projeto. Após a implantação, a Vercel fornecerá uma URL onde seu site estará disponível.

Pronto! Agora seu projeto está implantado e acessível online.