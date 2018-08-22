const fs = require('fs');
require('devbox-linq');

Array.prototype.average = function (expression) {

    if (!this.length) return 0;

    if (!expression) {
        return this.reduce((acum, cur) => acum + cur) / this.length;
    }

    let list = this.map(expression);

    return list.reduce((acum, cur) => acum + cur) / list.length

};

const folderName = 'C:/Users/Vinicius Mussak/Desktop/testecarga/passarela-stress-test/tests/30k/';

const informacoes = ['min', 'max', 'median', '200', 'ETIMEDOUT', 'ECONNRESET', 'ESOCKETTIMEDOUT', '400', '401', '500'];

let files = fs.readdirSync(folderName);

var meusTestes = [];

files.forEach(file => {
    meusTestes.push(readTestFile(file));
});

let data = {
    testes: meusTestes
}

fs.writeFileSync('resultado.json', JSON.stringify(data));

function readTestFile(fileName) {
    let content = fs.readFileSync(`${folderName}${fileName}`, 'utf8');

    let testes = content.split('All virtual users finished');

    let esseTeste = [];

    for (let i = 1; i <= testes.length; i++) {
        let linhas = testes[i] ? testes[i].split("\r\n") : null;
        let meuteste = {};

        if (!linhas) continue;

        linhas.forEach(linha => {
            let info = linha.split(":");
            if (informacoes.includes(info[0].trim()))
                meuteste[info[0].trim()] = Number(info[1].trim());
        });

        esseTeste.push(meuteste);
    }

    let testeDeVerdade = {};


    testeDeVerdade['min'] = esseTeste.where(x => !isNaN(x.min)).min(x => x.min);
    testeDeVerdade['max'] = esseTeste.where(x => !isNaN(x.max)).max(x => x.max);
    testeDeVerdade['median'] = esseTeste.where(x => !isNaN(x.median)).average(x => x.median);;
    testeDeVerdade['200'] = esseTeste.where(x => !isNaN(x['200'])).sum(x => x['200']);
    testeDeVerdade['ETIMEDOUT'] = esseTeste.where(x => !isNaN(x['ETIMEDOUT'])).sum(x => x['ETIMEDOUT']);;
    testeDeVerdade['ECONNRESET'] = esseTeste.where(x => !isNaN(x['ECONNRESET'])).sum(x => x['ECONNRESET']);;
    testeDeVerdade['ESOCKETTIMEDOUT'] = esseTeste.where(x => !isNaN(x['ESOCKETTIMEDOUT'])).sum(x => x['ESOCKETTIMEDOUT']);;
    testeDeVerdade['400'] = esseTeste.where(x => !isNaN(x['400'])).sum(x => x['400']);;
    testeDeVerdade['401'] = esseTeste.where(x => !isNaN(x['401'])).sum(x => x['401']);;
    testeDeVerdade['500'] = esseTeste.where(x => !isNaN(x['500'])).sum(x => x['500']);;

    return {
        funcionalidade: fileName.split('.')[0],
        teste: testeDeVerdade
    }
}


