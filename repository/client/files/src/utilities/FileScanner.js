import uuid from 'uuid';
import FileActions from "../actions/FileActions";

class FileScanner {

    processFile = async function (file_, path_, relPath_) {
        //_fileList.push(file_);
        if (!file_.id) {
            file_.id = uuid();
        }
        file_.progress = 0;
        file_.status = "uploadReady";
        file_.uploadPath = path_;
        file_.uploadProgress = 30.0;
        if (relPath_) {
            file_.relativePath = relPath_;
        }

        console.debug('FILE:' +file_.uploadPath);
        FileActions.stageFile.next(file_);
    };


    readDir = async function (entry, file, path) {
        var self = this;
        // Get folder contents
        //var file = dataTransferItem.getAsFile();
        var dirReader = entry.createReader();
        dirReader.readEntries(async  function (entries) {

            for (let j = 0; j < entries.length; j++) {
                var entry = entries[j];
                //console.dir(entry);
                //console.dir(entry.file);
                const relPath = entry.fullPath;
                if (entry.isFile) {
                    entry.file(async (f) => {
                        await self.processFile(f, path, relPath);
                    });
                } else if (entry.isDirectory) {
                    console.debug('DIR:' +entry.fullPath);
                    await self.readDir(entry, file, path);
                }
            }

        });

    };


    scanFiles = async function(e, path_, files) {
        FileActions.stageAction.next("open");
        if (e.dataTransfer) {
            var _items = e.dataTransfer.items;
            for (var i = 0; i < _items.length; i++) {
                const _path = path_;
                var dataTransferItem = _items[i];
                var file = dataTransferItem.getAsFile();
                var entry = dataTransferItem.webkitGetAsEntry();

                if (entry.isFile) {
                    await this.processFile(file, _path)
                } else if (entry.isDirectory) {
                    await this.readDir(entry, file, _path);
                }
            }
        } else if (files) {
            const _path = path_;
            for (const file of files) {
                this.processFile(file, _path);
            }
        }
    }

}

export default FileScanner;