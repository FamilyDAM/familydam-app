import {Subject} from '@reactivex/rxjs';
import ListPhotosService from "./processors/ListPhotosService";
import ListFoldersService from "./processors/ListFoldersService";

class PhotoActions {

    constructor() {
        this.listFoldersService = new ListFoldersService(this.listFolders.source, this.listFolders.sink);
        this.listPhotosService = new ListPhotosService(this.listPhotos.source, this.listPhotos.sink);
    }

    listFolders = {'source': new Subject(), 'sink': new Subject()};
    listPhotos = {'source': new Subject(), 'sink': new Subject()};
}

export default new PhotoActions();
