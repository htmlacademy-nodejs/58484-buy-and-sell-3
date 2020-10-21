'use strict';

const {ChalkTheme} = require(`./chalk-theme`);
const {success} = ChalkTheme.help;
const {MOCKS_FILE_NAME} = require(`../../constants`);

const commandText = `
  Программа запускает http-сервер и формирует файл с данными для API.
    Гайд:
    service.js <command>

    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --generate <count>    формирует файл ${MOCKS_FILE_NAME}
`;

module.exports = {
  name: `--help`,
  run() {
    console.info(success(commandText));
  }
};
