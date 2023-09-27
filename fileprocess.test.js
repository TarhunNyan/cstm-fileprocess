const fp = require('./fileprocess');
const basePath = 'C:/Users/Cucumber/Documents/MyProjects/0001_00-Programming/2023_09-(lib-js)FileProcess/.testFolder';
const basePath_previous = 'C:/Users/Cucumber/Documents/MyProjects/0001_00-Programming/2023_09-(lib-js)FileProcess';
const basePath_filename = 'C:/Users/Cucumber/Documents/MyProjects/0001_00-Programming/2023_09-(lib-js)FileProcess/.testFolder/file1.txt';
const basePath_filename_noExtension = 'C:/Users/Cucumber/Documents/MyProjects/0001_00-Programming/2023_09-(lib-js)FileProcess/.testFolder/file1';

describe(
    "Манипуляции с путями. Base:",
    () => {
        it("path__join", () => {
            expect(fp.path__join(['C:/Users/Cucumber', 'folder1', 'folder2', 'file.txt'])).toBe('C:\\Users\\Cucumber\\folder1\\folder2\\file.txt');
        });

        it("path__updateSeparator", () => {
            const result = fp.path__join([basePath]);
            expect(fp.path__updateSeparator(basePath.replaceAll('\\', '/'))).toBe(result);
            expect(fp.path__updateSeparator(basePath)).toBe(result);
        });
    }
);

describe(
    "Манипуляции с путями. Получение(get):",
    () => {
        it("path__getDir", () => {
            expect(fp.path__getDir(basePath)).toBe(
                fp.path__updateSeparator(basePath_previous)
            );
        });

        it("path__getLastName - без файла в пути", () => {
            expect(fp.path__getLastName(basePath)).toBe('.testFolder');
        });

        it("path__getLastName - с файлом в пути", () => {
            expect(fp.path__getLastName(basePath_filename)).toBe('file1');
        });

        it("path__getFileName - без файла в пути", () => {
            expect(fp.path__getFileName(basePath)).toBe('');
        });

        it("path__getFileName - с файлом в пути", () => {
            expect(fp.path__getFileName(basePath_filename)).toBe('file1');
        });

        it("path__getExt", () => {
            expect(fp.path__getExt(basePath_filename)).toBe('.txt');
        });

        it("path__getByInd", () => {
            expect(fp.path__getByInd(basePath_filename, 0)).toBe('C:');
            expect(fp.path__getByInd(basePath_filename, 1)).toBe('Users');
            expect(fp.path__getByInd(basePath_filename, -1)).toBe('file1.txt');
            expect(fp.path__getByInd(basePath_filename, -2)).toBe('.testFolder');
        });
    }
)

describe(
    "Манипуляции с путями. Удаление(del):",
    () => {
        it("path__delDir", () => {
            expect(fp.path__delDir(basePath_filename)).toBe('file1.txt');
        });

        it("path__delFileName - без файла в пути", () => {
            expect(fp.path__delFileName(basePath)).toBe(
                fp.path__updateSeparator(basePath)
            );
        });

        it("path__delFileName - с файлом в пути", () => {
            expect(fp.path__delFileName(basePath_filename)).toBe(
                fp.path__updateSeparator(basePath)
            );
        });

        it("path__delLastName - без файла в пути", () => {
            expect(fp.path__delLastName(basePath)).toBe(
                fp.path__updateSeparator(basePath_previous)
            );
        });

        it("path__delLastName - с файлом в пути", () => {
            expect(fp.path__delLastName(basePath_filename)).toBe(
                fp.path__updateSeparator(basePath)
            );
        });

        it("path__delExt", () => {
            expect(fp.path__delExt(basePath_filename)).toBe(
                fp.path__updateSeparator(basePath_filename_noExtension)
            );
        });
    }
);

describe(
    "Манипуляции с путями. Замена(replace):",
    () => {
        it("path__replaceDir", () => {
            expect(fp.path__replaceDir(basePath, 'MyProjects')).toBe(
                fp.path__updateSeparator('C:\\Users\\Cucumber\\Documents\\0001_00-Programming\\2023_09-(lib-js)FileProcess\\.testFolder')
            );
            expect(fp.path__replaceDir(basePath, 'Documents/MyProjects', 'Hello World')).toBe(
                fp.path__updateSeparator('C:\\Users\\Cucumber\\Hello World\\0001_00-Programming\\2023_09-(lib-js)FileProcess\\.testFolder')
            );
        });

        it("path__replaceFileName", () => {
            expect(fp.path__replaceFileName(basePath_filename, 'Hello World')).toBe(
                fp.path__updateSeparator(basePath_filename.replace('file1.txt', 'Hello World.txt'))
            );
        });

        it("path__replaceExt", () => {
            expect(fp.path__replaceExt(basePath_filename, '.js')).toBe(
                fp.path__updateSeparator(basePath_filename.replace('.txt', '.js'))
            );
        });
    }
);

describe(
    "Запись/чтение/создание:",
    () => {
        const testPath = fp.path__join([__dirname, '.testFolder']);
        const testPath_filename = fp.path__join([testPath, 'test.txt']);
        const testPath_filenameJSON = fp.path__join([testPath, 'test.json']);
        const data = 'Test txt';
        const data_JSON = { "name": "cstm-jssupport", "version": "0.0.1" };

        it("node__isExist", () => {
            expect(fp.path__isExist(__filename)).toBe(true)
        })

        it("node__create, папка", () => {
            expect(fp.node__create(testPath)).toBe(fp.path__isExist(testPath))
        })

        it("node__create, файл", () => {
            expect(fp.node__create(testPath_filename, data)).toBe(fp.path__isExist(testPath_filename))
        })

        it("file__writeJSON, файл", () => {
            expect(fp.file__writeJSON(testPath_filenameJSON, data_JSON)).toBe(fp.path__isExist(testPath_filenameJSON))
        })

        it("file__read", () => {
            expect(fp.file__read(testPath_filename)).toBe(data);
        })

        it("file__readJSON", () => {
            expect(fp.file__readJSON(testPath_filenameJSON)).toEqual(data_JSON);
        })

        it("file__delete", () => {
            expect(fp.file__delete(testPath_filename)).toBe(!fp.path__isExist(testPath_filename));
        })

        it("dir__delete", () => {
            expect(fp.dir__delete(testPath)).toBe(!fp.path__isExist(testPath));
        })
    }
);

describe(
    "Проверка на получение списков папок и файлов:",
    () => {
        const baseFolder = fp.path__join([__dirname, '.testFolder']);
        const paths = [
            fp.path__join([baseFolder, 'folder1', 'lvl3-1.txt']),
            fp.path__join([baseFolder, 'folder1', 'lvl3-2.txt']),
            fp.path__join([baseFolder, 'folder2', 'lvl3-3.txt']),
            fp.path__join([baseFolder, 'folder3']),
            fp.path__join([baseFolder, 'folder4', 'folder', 'lvl4.txt']),
            fp.path__join([baseFolder, 'lvl1.txt']),
        ];

        beforeAll(() => { for (path of paths) { fp.node__create(path); } });
        afterAll(() => { fp.dir__delete(baseFolder) });

        it("dir__getFileList", () => {
            expect(fp.dir__getFileList(baseFolder)).toEqual([
                fp.path__join([baseFolder, 'lvl1.txt'])
            ]);
        })

        it("dir__getDirList", () => {
            expect(fp.dir__getDirList(baseFolder)).toEqual([
                fp.path__join([baseFolder, 'folder1']),
                fp.path__join([baseFolder, 'folder2']),
                fp.path__join([baseFolder, 'folder3']),
                fp.path__join([baseFolder, 'folder4'])
            ]);
        })

        it("dir__getContentList", () => {
            expect(fp.dir__getContentList(baseFolder)).toEqual([
                fp.path__join([baseFolder, 'folder1']),
                fp.path__join([baseFolder, 'folder2']),
                fp.path__join([baseFolder, 'folder3']),
                fp.path__join([baseFolder, 'folder4']),
                fp.path__join([baseFolder, 'lvl1.txt']),
            ]);
        })

        it("dir__getFileList_Recursive", () => {
            expect(fp.dir__getFileList_Recursive(baseFolder)).toEqual([
                fp.path__join([baseFolder, 'folder1', 'lvl3-1.txt']),
                fp.path__join([baseFolder, 'folder1', 'lvl3-2.txt']),
                fp.path__join([baseFolder, 'folder2', 'lvl3-3.txt']),
                fp.path__join([baseFolder, 'folder4', 'folder', 'lvl4.txt']),
                fp.path__join([baseFolder, 'lvl1.txt']),
            ]);
        })

        it("dir__getDirList_Recursive", () => {
            expect(fp.dir__getDirList_Recursive(baseFolder)).toEqual([
                fp.path__join([baseFolder, 'folder1']),
                fp.path__join([baseFolder, 'folder2']),
                fp.path__join([baseFolder, 'folder3']),
                fp.path__join([baseFolder, 'folder4']),
                fp.path__join([baseFolder, 'folder4', 'folder']),
            ]);
        })

        it("dir__getDirList_Recursive, isEndPoint=true", () => {
            expect(fp.dir__getDirList_Recursive(baseFolder, true)).toEqual([
                fp.path__join([baseFolder, 'folder3']),
            ]);
        })

        it("dir__getContentList_Recursive", () => {
            expect(fp.dir__getContentList_Recursive(baseFolder)).toEqual([
                fp.path__join([baseFolder, 'folder1']),
                fp.path__join([baseFolder, 'folder1', 'lvl3-1.txt']),
                fp.path__join([baseFolder, 'folder1', 'lvl3-2.txt']),
                fp.path__join([baseFolder, 'folder2']),
                fp.path__join([baseFolder, 'folder2', 'lvl3-3.txt']),
                fp.path__join([baseFolder, 'folder3']),
                fp.path__join([baseFolder, 'folder4']),
                fp.path__join([baseFolder, 'folder4', 'folder']),
                fp.path__join([baseFolder, 'folder4', 'folder', 'lvl4.txt']),
                fp.path__join([baseFolder, 'lvl1.txt']),
            ]);
        })

        it("dir__getContentList_Recursive, isEndPoint=true", () => {
            expect(fp.dir__getContentList_Recursive(baseFolder, true)).toEqual([
                fp.path__join([baseFolder, 'folder1', 'lvl3-1.txt']),
                fp.path__join([baseFolder, 'folder1', 'lvl3-2.txt']),
                fp.path__join([baseFolder, 'folder2', 'lvl3-3.txt']),
                fp.path__join([baseFolder, 'folder3']),
                fp.path__join([baseFolder, 'folder4', 'folder', 'lvl4.txt']),
                fp.path__join([baseFolder, 'lvl1.txt']),
            ]);
        })

    }
);
