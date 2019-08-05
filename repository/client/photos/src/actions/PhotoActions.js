import {Subject} from '@reactivex/rxjs';
import ListPhotosService from "./processors/ListPhotosService";

class PhotoActions {

    constructor() {
        this.listPhotosService = new ListPhotosService(this.listPhotos.source, this.listPhotos.sink);
    }


    listPhotos = {'source': new Subject(), 'sink': new Subject()}

}

export default new PhotoActions();
