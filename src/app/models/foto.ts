export class Foto {

    uid: string;
    file: File;
    nombre: string;
    url: string;
    progress: number;
    createdAt: string;

    constructor(file:File){
        this.file = file;
    }
}
