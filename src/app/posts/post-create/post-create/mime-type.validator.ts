import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";
/* #77 */
/* la funzione restituisce una promise o un observable essendo async */
/* Promise<{[key: string]}> indica la restituzione di un obj js che conterrà una stringa con nome
dinamico, le parentesi quadre non significano quindi un array */
export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs =  new Observable((observer: Observer<{[key: string]: any}>) => {
        fileReader.addEventListener("loadend", () => {
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header ="";
            let isValid = false;
            for (let i = 0; i < arr.length; i++){ //crea una stringa esadecimale dal file immagine importato
                header += arr[i].toString(16);
            }
            switch (header){                    //confronta la stringa ottenuta con delle stringhe standard di identificazione del tipo di file
                case "89504e47":    // png
                isValid = true;
                break;
                case "ffd8ffe0":    //5 varianti di jpeg
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                isValid = true;
                break;
                default:
                isValid = false; // Or you can use the blob.type as fallback
                break;
            }
            if (isValid){
                observer.next(null); //significa che il file è valido, passato oggetto vuoto anzichè NULL
            } else {
                observer.next({ invalidMimeType: true});
            }
            observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
    });
    return frObs;
};