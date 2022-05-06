const showdown = require('showdown')
const fs = require('fs')
const cheerio = require('cheerio')

const allMarkdownFiles = fs.readdirSync(`docs/src/markdownFiles/`)

const generateSideBarLinks = (allMarkdownFiles) => {
    const sidebarLinks = allMarkdownFiles.map(file => {
        return `
      <a href="${file.split('.')[0]}.html" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        ${file.split('.')[0]}-DGS
        </a>
        `
    })
    return sidebarLinks
}

const generateSideBarLinksForIndexFile = (allMarkdownFiles) => {
  const sidebarLinks = allMarkdownFiles.map(file => {
      return `
      <li>
    <a href="${file.split('.')[0]}.html">
      ${file.split('.')[0]}-DGS
      </a>
      </li>
      `
  })
  return sidebarLinks
}

const cleanupAndSetupIndexFile = () => {
    const indexFile = fs.readFileSync('docs/src/index.html', 'utf-8')
    const $ = cheerio.load(indexFile, null, true);
    $('nav').prepend(`
            <div class="nav-group">
            <h4 class="nav-group-title">DGS Documentation</h5>
              <ul class="nav-group-items">
              ${generateSideBarLinksForIndexFile(allMarkdownFiles).join('')}

              </ul>
          </div>
        `)
    $('link').remove();
    $('head').prepend(`
    <link rel="stylesheet" href="/css/spectaql.min.css">
    `)
    $('#logo').children().remove()
    $('#logo').append(`
      <img
        src="../src/images/volvo-wordmark-black.svg"
        alt="Volvo Cars"
      />
    `)
    fs.writeFileSync('docs/src/index.html', $.html())
}

const convertAllMarkdownFilesToHTML = (allMarkdownFilesPath) => {
    allMarkdownFilesPath.forEach(file => {
        const converter = new showdown.Converter();
        const text      = fs.readFileSync(`docs/src/markdownFiles/${file}`, 'utf-8')
        const html      = converter.makeHtml(text);
        const $ = cheerio.load(html, null, true);
        $('head').append(`<meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
        <link href="/css/output.css" rel="stylesheet" />
        <script src=" https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js"></script>
        <title>${file.split('.')[0]}-DGS</title>`)
        $('html').addClass('h-full bg-gray-100')
        $('body').addClass('h-full')
        $('body').wrapInner('<div class="docs prose relative w-full px-6 py-12 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28">')
        $('.docs').before(`
        <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div class="flex-1 flex flex-col min-h-0 bg-white">
          <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div class="flex items-center flex-shrink-0 px-4">
              <img
                class="h-8 w-auto"
                src="../src/images/volvo-wordmark-black.svg"
                alt="Workflow"
              />
            </div>
            <nav class="mt-5 flex-1 px-2 space-y-1">
            <a href="index.html" class="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
            <svg class="text-gray-500 mr-4 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Index
             </a>
            ${generateSideBarLinks(allMarkdownFiles).join('')}
            </nav>
          </div>
        </div>
      </div>
        `)
        $('.docs').wrap(`
        <main class="flex-1">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div class="py-4">
            </div>
          </div>
        </div>
      </main>
        `)
        $('.mermaid').parent().addClass('bg-white')
        fs.writeFileSync(`docs/src/${file.split('.')[0]}.html`, $.html())
    });
}
convertAllMarkdownFilesToHTML(allMarkdownFiles)
cleanupAndSetupIndexFile()