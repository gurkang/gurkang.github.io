const fs = require('fs')
const cheerio = require('cheerio')

const indexFile = fs.readFileSync('/home/gustav/projects/websites/graph-docs/src/index.html', 'utf-8')
const $ = cheerio.load(indexFile, null, true);

$('.operation-deprecated').parent().remove().children().remove()
// $('div.operation-deprecated').parent().remove().children().remove()
fs.writeFileSync('/home/gustav/projects/websites/graph-docs/src/index.html', $.html())