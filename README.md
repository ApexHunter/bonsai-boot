# Workflow para frontend usando Gulp

A ideia é utilizar nesse workflow:

* Geração de CSS minificado através com mixins usando o Sass+Bourbon (``gulp-sass``);
* Gerar htmls através de includes com template engine (Handlebars), porém, o resultado final deverá ser estático;
* Levantar um servidor básico usando Express
* Fazer reload automático quando uma página for alterada (live preview)
* Testar, corrigir e minificar Javascript de Frontend
* Instalar bibliotecas e recursos utilizando Yarn
* Deixar apenas como pré-requisito o Node.js, Express.js e o Gulp.js
* Bootstrap 4
* Yarn como centralizador de gerenciamento de pacotes
* Documentação automática através do KSS para Node.ks (``kss``), através do comando `npm run kss`


## Pré-requisito

Caso não tenha o Gulp instalado globalmente:

``npm install gulp -g``

Também é preciso instalar o Yarn globalmente:

``npm install --global yarn``

## Instalação

Ao clonar o projeto você irá precisar realizar os dois itens abaixo.

Baixe o projeto e dê:

``npm install``


## Tarefas cadastradas

As tarefas estão em fase inicial, mas já dá pra utilizá-las para desenvolvimento.

### Converte Sass com 'node-sass', 'bourbon', 'neat', 'autoprefixer' e 'sourcemaps'

``gulp sass``

Os arquivos são salvos na pasta ´´dist/css´´.

### Gera HTMLs utilizando o Handlebars.js

``gulp hbs``

Ela gera os arquivos html que estão na pasta ``src/templates/pages``, mas pode usar os arquivos na pasta ``src/templates/partials`` para compor sua estrutura como *partiais* do *Handlebars.js*.

Os arquivos são salvos na pasta ``dist``.

### Vigia modificações nos arquivos

``gulp watch``

Essa é a tarefa principal, ela ficará rodando enquanto não for interrompida e processa todos os arquivos editados na pasta ``src``.

A tarefa vigia os arquivos da tarefa ``gulp-sass``, ``gulp-handlebars`` e ``gulp-fonts``. Toda vez que tem alteração em arquivos presentes nestas tasks (.hbs, .scss, .sass, etc) nas pastas específicas de cada uma ele as executa.

Depois de fazer qualquer modificação ela carrega um servidor e abre em seu navegador padrão o arquivo ``dist/main.html``. Isso acontece na porta 8080. Se quiser ver outros arquivos basta colocar a URL sempre partindo do diretório ``src``.

**Exemplos:**

```
localhost:8080/seuarquivo.html
localhost:8080/umdiretorio/seuarquivo.html
```

##Outras tasks
``gulp browserSync``

``gulp fonts``

``gulp images``

``gulp images:opt``

``gulp js``

``gulp useref``

``gulp clean:dist``

``gulp build``

``gulp build:min``

``gulp default``

##Estrutura de pastas

```
static
  |_dist (arquivos gerados pela task ``gulp deploy`` ou pela ``gulp-watch``)
    |_css
      |_ ...
    |_img
    |_js
      |_plugins
      |_vendors
      |_ ...
  src
    |_scss
      |_ ...
    |_img
    |_js
      |_plugins
      |_vendors
      |_ ...
    |_templates
      |_data
      |_helpers
      |_pages
      |_partials
        |_atoms
        |_molecules
        |_organisms
```

##Atualização

###**2017.07.09** Adicionado o `kss-node`
Ele gera documentação automaticamente através de uma task pelo `npm` e permite fazer a documentação direto nos SCSS. Isso facilita organização do código e permite controle sobre escalabilidade de código para interfaces reaproveitáveis. Veja mais em http://warpspire.com/kss/

###**2017.02.24** Suporte a ES2015 e instalação do gulp-babel
Para arquivos JS serem processados e "traduzidos" de ES2015 para Javascript eles precisam ser colocados na pasta `src/js/es2015`. Depois de processados pela task `gulp js-babel` (que roda pelo `gulp watch` também) eles são jogados já na pasta raiz `dist/js` (são removidos da subpasta `/es2015`). Tive que fazer isso porque o `gulp-babel` estava renderizando arquivos minificados e plugins, dando problema nos mesmos. Para evitar isso, somente arquivos mapeados como *ES2015* serão processados.
