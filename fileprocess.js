// fileProcess.js v0.0.5

const { promises } = require('dns');
var fs = require('fs');
var path = require('path');


/**
 * Объединяем подпути в правильный путь. Дублирование path.join(синхронно)
 * @param {string[]} paths Путь к файлу
 * @return {string} Путь к папке с файлом 
 */
// function join(paths) {
function path__join(paths) {
    return path.join(...paths);
}

/**
 * Системная информация о папке/файле. Дата последнего редактирования
 * @param {string} path Путь
 * @return {number | undefined} Дата последнего редактирования
 */
function path__statLastEdit(path) {
    if (path__isExist(path)) { return fs.statSync(path).mtime; }
    return undefined;
}

/**
 * Приводим к одному виду путь
 * @param {string} path Путь
 * @return {string} Путь с обновленным сепаратором
 */
function path__updateSeparator(path) {
    if (path.indexOf(path.sep) === -1) { return path__join([path]) }
    return path;
}

/**
 * Создаем папку/файл по указанном пути
 * @param {string} path Путь к папке/файлу
 * @param {string} data Строка которая записывается в файл, если это файл
 * @param {boolean | undefined} isFile Если true создаем в конце файл. Если undefined, то определяет по наличию extension
 * @return {undefined} 
 */
// function mkdirSync(path, isFile = undefined, data = '') {
function node__create(path, data = '', isFile = undefined) {
    if (isFile === undefined) {
        const extension = path__getExt(path);
        if (extension === '.') {
            throw new Error(`У пути ${path} в конце точка, а extension не написан! `)
        }
        isFile = extension === '' ? false : true;
    }

    if (!isFile) {
        fs.mkdirSync(path, { recursive: true });
        return true;
    }
    if (isFile) {
        fs.mkdirSync(path__delFileName(path), { recursive: true });
        file__write(path, data);
        return true;
    }

    return false;
}

/**
 * Создаем папку/файл по указанном пути(асинхронно)
 * @param {string} paths Путь к папке/файлу
 * @param {string} data Строка которая записывается в файл, если это файл
 * @param {boolean | undefined} isFile Если true создаем в конце файл. Если undefined, то определяет по наличию extension
 * @return {promises}  Возвращает Promise:
 * - Если записал, то resolve(data)
 * - Если ошибка записи, то reject(err)
 */
// function mkdir(path, isFile = undefined, data = '') {
function node__createAsync(path, data = '', isFile = undefined) {
    if (isFile === undefined) {
        const extension = path__getExt(path);
        if (extension === '.') {
            throw new Error(`У пути ${path} в конце точка, а extension не написан! `)
        }
        isFile = extension === '' ? false : true;
    }

    if (!isFile) {
        return fs.mkdir(path, { recursive: true }, () => { });
    }
    if (isFile) {
        fs.mkdirSync(path__delFileName(path), { recursive: true });
        return writeFile(path, data);
    }
}

/**
 * Получаем путь к папке с файлом 
 * @param {string} filepath Путь к файлу
 * @return Путь к папке с файлом 
 */
// function edpDelFileName(filepath) {
function path__getDir(filepath) {
    const parsing = path.parse(filepath);
    return path.resolve(parsing.dir);
}

/**
 * Получаем имя файла
 * @param {string} filepath Путь к файлу
 * @return Имя файла 
 */
function path__getFileName(filepath) {
    const parsing = path.parse(filepath);
    if (parsing.ext != '') { return parsing.name; }
    return '';
}

/**
 * Получаем имя последней папки/файла в пути
 * @param {string} filepath Путь к файлу/папке
 * @return Имя последней папки/файла 
 */
// function edpGetFileName(filepath) {
function path__getLastName(filepath) {
    const parsing = path.parse(filepath);
    return parsing.name;
}

/**
 * Получаем разрещение файла
 * @param {string} filepath Путь к файлу
 * @return {string} Разрещение файла 
 */
// function edpGetFileExt(filepath) {
function path__getExt(filepath) {
    const parsing = path.parse(filepath);
    return parsing.ext;
}

/**
 * Получение папки/файла по индексу
 * @param {string} filepath Путь к файлу
 * @param {number} index Номер папки/файла в пути
 * @return Полуенное имя папки/файла
 */
// function edpChangeSubPath(filepath, fromSubpath, toSubpath) {
function path__getByInd(filepath, index) {
    filepath = path__updateSeparator(filepath);
    const arr = filepath.split(path.sep);
    return arr.at(index);
}

/**
 * Удаляем путь до файла, оставляем только файл и разрешение
 * @param {string} filepath Путь к файлу
 * @return Имя файла и зазрешение 
 */
function path__delDir(filepath) {
    const name = path__getFileName(filepath);
    const ext = path__getExt(filepath);
    return name + ext;
}

/**
 * Удаляет из пути имя файла 
 * @param {string} filepath Путь к файлу
 * @return Путь к папке с файлом 
 */
function path__delFileName(filepath) {
    if (path__getExt(filepath) === '') { return path__updateSeparator(filepath); }
    return path__getDir(filepath);
}

/**
 * Удаляет имя последней папки/файла из пути
 * @param {string} filepath Путь к папке/файлу
 * @return Путь к папке/файлу
 */
function path__delLastName(filepath) {
    return path__getDir(filepath);
}

/**
 * Получаем путь к файлу без extension
 * @param {string} filepath Путь к файлу
 * @return Путь к файлу без extension
 */
// function edpDelFileExt(filepath) {
function path__delExt(filepath) {
    const parsing = path.parse(filepath);
    const joining = parsing.dir != '' ? [parsing.dir, parsing.name] : [parsing.name];
    return path__join(joining);
}


/**
 * Замена части пути к файлу
 * @param {string} filepath Путь к файлу
 * @param {string} fromSubpath Часть пути к файлу котый меняем
 * @param {string} toSubpath Часть пкти к файлу НА который меняем
 * @return Путь к файлу с измененным подпутем
 */
// function edpChangeSubPath(filepath, fromSubpath, toSubpath) {
function path__replaceDir(filepath, fromSubpath = '', toSubpath = '') {
    filepath = path__updateSeparator(filepath);

    if (fromSubpath === '') { return filepath; }

    fromSubpath = path__updateSeparator(fromSubpath);
    toSubpath = path__updateSeparator(toSubpath);

    const ind = filepath.indexOf(fromSubpath);

    if (ind === -1) { return filepath; }

    const arr = [filepath.slice(0, ind), toSubpath, filepath.slice(ind + fromSubpath.length)]

    return path__join(arr);
}

/**
 * Заменяет имя файла
 * @param {string} filepath Путь к файлу
 * @param {string} newFileName Имя файла на которое производим замену
 * @return Путь к файлу с измененным разрешением
 */
// function edpChangeFileExt(filepath, from, to) {
function path__replaceFileName(filepath, newFileName) {
    const parsing = path.parse(filepath);
    return path.resolve(parsing.dir, newFileName) + parsing.ext;
}

/**
 * Заменяет разрешение файла
 * @param {string} filepath Путь к файлу
 * @param {string} to Разрешение на которое меняем
 * @return Путь к файлу с измененным разрешением
 */
// function edpChangeFileExt(filepath, from, to) {
function path__replaceExt(filepath, newExtension) {
    const parsing = path.parse(filepath);
    if (newExtension[0] != '.') { newExtension = '.' + newExtension; }
    return path.resolve(parsing.dir, parsing.name) + newExtension;
}

/**
 * Проверяет, существует ли путь. Переиспользование fs.existsSync
 * @param {string} filepath Путь к файлу
 * @returns {boolean} Возвращает существует или нет такой путь
 */
// function isExistSync(filepath) {
function path__isExist(filepath) {
    return fs.existsSync(filepath);
}

/**
 * Проверяет, существует ли путь(асинхронно)
 * @param {string} filepath Путь к файлу
 * @param {Object} data Какая-то информация для передачи дальше
 * @returns {Promise} Возвращает Promise:
 * - Если путь есть, то resolve(data)
 * - Если пути нет, то reject(data)
 */
// function isExist(filepath, data = {}) {
function path__isExistAsync(filepath, data = {}) {
    return new Promise((resolve, reject) => {
        fs.access(filepath, fs.constants.F_OK, (err) => {
            if (err === null) { resolve(data) }
            else { reject(data) }
        })
    })
}

/**
 * Считываем файл
 * @param {string} filepath Путь к файлу
 * @param {string} encoding Кодировка в которой записан файл
 * @returns {string} Строку с содержимым файла
 */
// function readFile(filepath, encoding = 'utf-8') {
function file__read(filepath, encoding = 'utf-8') {
    return fs.readFileSync(filepath, encoding);
}

/**
 * Считываем файл(асинхронно)
 * @param {string} filepath Путь к файлу
 * @param {string} encoding Кодировка в которой записан файл
 * @returns {Promise} Возвращает Promise:
 * - Если прочитал, то resolve(data)
 * - Если ошибка чтения, то reject(err)
 */
// function readFile(filepath, encoding = 'utf-8') {
function file__readAsync(filepath, encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
        console.log(filepath)
        fs.readFile(filepath, encoding, (err, data) => {
            if (err) { reject(err) }
            else { resolve(data) }
        })
    })
}

/**
 * Считываем файл JSON в Object
 * @param {string} filepath Путь к файлу
 * @param {string} encoding Кодировка в которой записан файл
 * @returns {Promise} Возвращает Promise:
 * - Если прочитал, то resolve(json)
 * - Если ошибка чтения, то reject(err)
 */
// function readJSON(filepath, encoding = 'utf-8') {
function file__readJSON(filepath, encoding = 'utf-8') {
    const data = fs.readFileSync(filepath, encoding);
    return JSON.parse(data.toString());
}

/**
 * Считываем файл JSON в Object(асинхронно)
 * @param {string} filepath Путь к файлу
 * @param {string} encoding Кодировка в которой записан файл
 * @returns {Promise} Возвращает Promise:
 * - Если прочитал, то resolve(json)
 * - Если ошибка чтения, то reject(err)
 */
// function readJSON(filepath, encoding = 'utf-8') {
function file__readJSONAsync(filepath, encoding = 'utf-8') {
    return readFile(filepath, encoding).then((data) => {
        return JSON.parse(data.toString());
    })
}

/**
 * Записываем в файл
 * @param {string} filepath Путь к файлу
 * @param {string} data Записываемый текст
 * @returns {string} Строку с содержимым файла
 */
// function writeFileSync(filepath, data) {
function file__write(filepath, data) {
    fs.writeFileSync(filepath, data);
}

/**
 * Записываем в файл(асинхронно)
 * @param {string} filepath Путь к файлу
 * @param {string} data Записываемый текст
 * @returns {Promise} Возвращает Promise:
 * - Если записал, то resolve(data)
 * - Если ошибка записи, то reject(err)
 */
// function writeFile(filepath, data) {
function file__writeAsync(filepath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, data, err => {
            if (err) { reject(err) }
            else { resolve(data) }
        })
    })
}

/**
 * Записываем Object в файл
 * @param {string} filepath Путь к файлу
 * @param {string} json Записываемый Object
 * @returns {Promise} Возвращает Promise:
 * - Если записал, то resolve(jsonData)
 * - Если ошибка записи, то reject(err)
 */
function file__writeJSON(filepath, json) {
    const jsonData = JSON.stringify(json);
    fs.writeFileSync(filepath, jsonData);
    return true;
}

/**
 * Записываем Object в файл(асинхронно)
 * @param {string} filepath Путь к файлу
 * @param {string} json Записываемый Object
 * @returns {Promise} Возвращает Promise:
 * - Если записал, то resolve(jsonData)
 * - Если ошибка записи, то reject(err)
 */
// function writeJSON(filepath, json) {
function file__writeJSONAsync(filepath, json) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(json)
        fs.writeFile(filepath, jsonData, err => {
            if (err) { reject(err) }
            else { resolve(jsonData) }
        })
    })
}

/**
 * Удаляем файл с диска
 * @param {string} filepath Путь к файлу
 * @returns {boolean} Возвращает удачно или неудачно закончилась операция
 */
function file__delete(filepath) {
    if (path__isExist(filepath)) { fs.unlinkSync(filepath); }
    return true;
}

/**
 * Получаем список файлов
 * @param {string} path Путь к папке из которой получаем список
 * @returns {[string]} Массив с путями до файлов
 */
// function getFileList(filepath) {
function dir__getFileList(path) {
    const cntList = fs.readdirSync(path);
    const newList = cntList.map(cnt => { return path__join([path, cnt]) });
    const res = [];

    for (path of newList) { if (fs.statSync(path).isFile()) { res.push(path) } }

    return res;
}

/**
 * Получаем список файлов
 * @param {string} path Путь к папке из которой получаем список
 * @returns {[string]} Массив с путями до файлов
 */
function dir__getFileList_Recursive(path) {
    const contentList = dir__getContentList_Recursive(path, true);
    const res = [];

    for (path of contentList) { if (fs.statSync(path).isFile()) { res.push(path) } }

    return res;
}

/**
 * Получаем список файлов(асинхронно)
 * @param {string} filepath Путь к папке из которой получаем список
 * @returns {Promise} Возвращает Promise:
 * - Если смог прочитать файлы, то resolve([ filename1, filename2, ... ])
 * - Если ошибка чтения дирректории, то reject(err)
 */
// function getFileList(filepath) {
function dir__getFileListAsync(filepath) {
    return new Promise((resolve) => {
        fs.readdir(filepath, { withFileTypes: true }, (err, data) => {
            if (err) { reject(err) }
            else { resolve(data) }
        })
    }).then((dirList) => {
        const res = []
        dirList.forEach(dir => {
            if (dir.isFile()) { res.push(dir.name) }
        });
        return res;
    })
}

/**
 * Удаляем папку со всем содержимым с диска
 * @param {string} path Путь к папке
 * @returns {boolean} Возвращает удачно или неудачно закончилась операция
 */
function dir__delete(path) {
    if (path__isExist(path)) { fs.rmSync(path, { force: true, recursive: true }); }
    return true;
}

/**
 * Получаем список папок
 * @param {string} path Путь к папке из которой получаем список
 * @returns {[string]} Массив с путями до папок
 */
// function getFileList(path) {
function dir__getDirList(path) {
    const cntList = fs.readdirSync(path);
    const newList = cntList.map(cnt => { return path__join([path, cnt]) });
    const res = [];

    for (path of newList) { if (fs.statSync(path).isDirectory()) { res.push(path) } }

    return res;
}

/**
 * Получаем список папок
 * @param {string} path Путь к папке из которой получаем список
 * @param {boolean} isEndPoint Добавляет только папки являющиеся конечными
 * @returns {[string]} Массив с путями до папок
 */
function dir__getDirList_Recursive(path, isEndPoint = false) {
    const contentList = dir__getContentList_Recursive(path, isEndPoint);
    const res = [];

    for (path of contentList) { if (fs.statSync(path).isDirectory()) { res.push(path) } }

    return res;
}

/**
 * Получаем список папок(асинхронно)
 * @param {string} filepath Путь к папке из которой получаем список
 * @returns {Promise} Возвращает Promise:
 * - Если смог прочитать файлы, то resolve([ dirname1, dirname2, ... ])
 * - Если ошибка чтения дирректории, то reject(err)
 */
// function getFolderList(filepath) {
function dir__getDirListAsync(filepath) {
    return new Promise((resolve) => {
        fs.readdir(filepath, { withFileTypes: true }, (err, data) => {
            if (err) { reject(err) }
            else { resolve(data) }
        })
    }).then((dirList) => {
        const res = []
        dirList.forEach(dir => {
            if (dir.isDirectory()) { res.push(dir.name) }
        });
        return res;
    })
}

/**
 * Получаем список папок/файлов
 * @param {string} path Путь к папке из которой получаем список
 * @returns {[string]} Массив с путями до папок/файлов
 */
// function getFileList(filepath) {
function dir__getContentList(path) {
    const cntList = fs.readdirSync(path);
    const res = cntList.map(cnt => { return path__join([path, cnt]) });

    return res;
}

/**
 * Получаем список папок/файлов рекурсивно
 * @param {string} path Путь к папке из которой получаем список
 * @param {boolean} isEndPoint Добавляет только папки и файлы являющиеся конечными
 * @returns {[string]} Массив с путями до папок/файлов
 */
// function getFileList(filepath) {
function dir__getContentList_Recursive(path, isEndPoint = false) {
    const cntList = fs.readdirSync(path);
    const newList = cntList.map(cnt => { return path__join([path, cnt]) });
    const res = [];

    for (path of newList) {
        const stat = fs.statSync(path);
        if (stat.isDirectory()) {
            const contentDir = dir__getContentList_Recursive(path, isEndPoint);
            if (contentDir.length === 0 || isEndPoint === false) { res.push(path); }
            if (contentDir.length != 0) { Array.prototype.push.apply(res, contentDir); }
        }
        if (stat.isFile()) { res.push(path) }
    }

    return res;
}

/**
 * Получаем список файлов и папок(асинхронно)
 * @param {string} filepath Путь к папке из которой получаем список
 * @returns {Promise} Возвращает Promise:
 * - Если смог прочитать файлы, то resolve([ dirname1, dirname2, ... ])
 * - Если ошибка чтения дирректории, то reject(err)
 */
// function getFolderList(filepath) {
function dir__getContentListAsync(filepath) {
    return new Promise((resolve) => {
        fs.readdir(filepath, { withFileTypes: true }, (err, data) => {
            if (err) { reject(err) }
            else { resolve(data) }
        })
    }).then((dirList) => {
        const res = []
        dirList.forEach(dir => {
            res.push(dir.name)
        });
        return res;
    })
}

module.exports = {
    path__join,
    path__updateSeparator,
    path__statLastEdit,

    node__create,
    node__createAsync,

    path__getDir,
    path__getFileName,
    path__getLastName,
    path__getExt,
    path__getByInd,

    path__delDir,
    path__delFileName,
    path__delLastName,
    path__delExt,

    path__replaceDir,
    path__replaceFileName,
    path__replaceExt,

    path__isExist,
    path__isExistAsync,
    file__read,
    file__readAsync,
    file__readJSON,
    file__readJSONAsync,
    file__write,
    file__writeAsync,
    file__writeJSON,
    file__writeJSONAsync,
    file__delete,

    dir__getFileList,
    dir__getFileListAsync,
    dir__getFileList_Recursive,
    dir__getDirList,
    dir__getDirListAsync,
    dir__getDirList_Recursive,
    dir__getContentList,
    dir__getContentListAsync,
    dir__getContentList_Recursive,
    dir__delete,
}