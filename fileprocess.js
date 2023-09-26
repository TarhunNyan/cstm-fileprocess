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
function file__isExist(filepath) {
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
function file__isExistAsync(filepath, data = {}) {
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
    if (file__isExist(filepath)) { fs.unlinkSync(filepath); }
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
    if (file__isExist(path)) { fs.rmSync(path, { force: true, recursive: true }); }
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
 * @param {string} filepath Путь к папке из которой получаем список
 * @param {boolean} isFull Возвращать полный путь к папке?
 * @param {boolean} isRecursive Рекурсивно спускаемся по папкам?
 * @param {string[]} result Начальное значение, к которому добавляются новые результаты поиска
 * @returns {[string]} Массив с путями до папок
 */
function dir__getDirListRecursive(filepath, isFull = false, isRecursive = false, result = []) {

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
 * @returns {[string]} Массив с путями до папок/файлов
 */
// function getFileList(filepath) {
function dir__getContentList_Recursive(path) {
    const cntList = fs.readdirSync(path);
    const newList = cntList.map(cnt => { return path__join([path, cnt]) });
    const res = [];

    for (path of newList) {
        const stat = fs.statSync(path);
        if (stat.isDirectory()) {
            res.push(path);
            Array.prototype.push.apply(res, dir__getContentList_Recursive(path));
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

/**
 * @typedef DirList
 * @type {{
 *      dir: (string),
 *      path: (string),
 *      type: ('dit'|'file'),
 *      lastEdit?: (Date),
 *      files: (DirList[])
 * }}
 * @example
 *  [{
 *      dir: 'Nature Science',
 *      path: 'C:\\Users\\Cucumber\\Documents\\MyProjects\\2000.00-BaseInfo\\md\\Nature Science',
 *      lastEdit: 2023-03-05T01:45:34.218Z,
 *      type: 'dir',
 *      files: [ ... ]
 *  }]
 */

/**
 * Получаем список файлов и папок
 * @param {string} filepath Путь к папке в из которой получаем список
 * @param {Object} [options={}] Набор опций, определяющий поведение функции
 * @param {boolean} options.getLastEdit Если true - записываем дату последнего редактирования {@link DirList.lastEdit}
 * @param {boolean} options.recursive Если true - рекурсивно получаем всю структуру папки
 * @returns {(DirList[]|-1)} Посмотри {@link DirList} чтобы понять структуру. В случае ошибки, вернет -1
 */
// function getDirListSync(filepath, options = {}) {
function getDirListSync(filepath, options = {}) {
    const optionsDefault = { getLastEdit: false, recursive: true }
    options = { ...optionsDefault, ...options }
    const { getLastEdit, recursive } = options

    function getDirListSyncDecoratable(filepath, result = []) {
        fs.readdirSync(filepath).forEach((dir) => {
            const fullPath = path.resolve(filepath, dir);
            const dirStats = { dir, filepath: fullPath };
            const stats = fs.statSync(fullPath);

            if (getLastEdit) {
                dirStats.lastEdit = stats.mtime;
            }
            if (stats.isDirectory()) {
                dirStats.type = 'dir';
                dirStats.files = [];
                result.push(dirStats);
            }
            if (stats.isFile()) {
                dirStats.type = 'file';
                result.push(dirStats);
            }

            if (stats.isDirectory() && recursive) {
                return getDirListSyncDecoratable(fullPath, dirStats.files)
            }
        })
        return result;
    }

    try { return getDirListSyncDecoratable(filepath); }
    catch { return -1; }
}

/**
 * @deprecated
 * @param {string} filepath 
 * @param {Object} options 
 * @returns 
 */
function getDirList(filepath, options) {
    const defaultOptions = { sync: true, recursive: false, getLastEdit: false }
    options = { ...defaultOptions, ...options }

    const { sync, recursive, getLastEdit } = options
    if (recursive && sync) {
        return getDirListSync(filepath, getLastEdit)
    }

    if (!recursive && !sync) {
        return new Promise((resolve) => {
            fs.readdir(filepath, (err, data) => {
                if (err) { reject(err) }
                else { resolve(data) }
            })
        })
    }
}

/**
 * Сравнивает файлы по параметру, и возвращает подходящие
 * @param {(DirList[]|-1)} paths1 Список файлов и папок. Смотри {@link DirList}
 * @param {(DirList[]|-1)} paths2 Список файлов и папок. Смотри {@link DirList}
 * @param {Object.<string, string>} workingExts Набор разрешений файлов, с которыми работаем. Пример:
 * - Обрабатываем если разные разрешения и одно имя: { 'md': 'html' }
 * @param {function} compare Функция сравнения объектов. По умолчанию сравнивает даты
 * @returns {(DirList[]|-1)} Посмотри {@link DirList} чтобы понять структуру. В случае ошибки, вернет -1
 */
const filesCompare = function (paths1, paths2, workingExts, compare) {
    workingExts = { all: true, ...workingExts }
    if (compare === undefined) { compare = (a, b) => a.lastEdit > b.lastEdit }

    function checkFilesExt(ext1, ext2) {
        if (ext1 === ext2) { return true; }
        let res1 = workingExts[ext1];
        if (res1 === ext2) { return true; }
        return false;
    }

    function recursive(lpaths1, lpaths2, result = []) {
        for (let i = 0; i < lpaths1.length; i++) {
            const inpEl = lpaths1[i];
            // Получаем данные о файле 1
            const inpElFilepath = inpEl.dir;
            const inpElName = edpDelFileExt(inpElFilepath);
            const inpElExt = path.extname(inpElFilepath);
            for (let j = 0; j < lpaths2.length; j++) {
                const outEl = lpaths2[j];
                // Получаем данные о файле 2
                let outElFilepath = outEl.dir;
                const outElName = edpDelFileExt(outElFilepath);
                const outElExt = path.extname(outElFilepath);

                //
                console.log('--')
                console.log(inpElFilepath)
                console.log(outElFilepath)
                console.log(inpEl.type);
                // Если папка
                if (inpEl.type === 'dir') {
                    if (inpElFilepath === outElFilepath) {
                        console.log('here');
                        result = recursive(inpEl.files, outEl.files, result);
                        break;
                    }
                    // if (j === lpaths2.length - 1) {
                    //     result = recursive(inpEl.files, [{ dir: '', filepath: '', type: '', files: [] }], result);
                    //     break;
                    // }
                } else {
                    if (j === outEl.length - 1) {
                        result.push(inpEl.filepath);
                    } else {
                        console.log('ok')
                        console.log(inpEl, outEl)
                        console.log(compare(inpEl, outEl))
                        console.log(inpEl.lastEdit, outEl.lastEdit)
                        console.log(inpEl.lastEdit > outEl.lastEdit, inpEl.lastEdit === outEl.lastEdit, inpEl.lastEdit < outEl.lastEdit)
                        if (checkFilesExt(inpElExt, outElExt)) {
                            if (compare(inpEl, outEl)) {
                                result.push(inpEl.filepath, outElFilepath);
                            }
                        }
                    }

                }
            }
        }
        return result;
    }

    return recursive(paths1, paths2);
}


module.exports = {
    path__join,
    path__updateSeparator,

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

    file__isExist,
    file__isExistAsync,
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
    dir__getDirList,
    dir__getDirListAsync,
    dir__getContentList,
    dir__getContentListAsync,
    dir__getContentList_Recursive,
    dir__delete,
}