//
// codes.js
//
const nomeTeste = 'nomelindo';

export class TapeMachine{
    constructor(){
        this.recordedMessage = '';
    }
    record(message){
        this.recordedMessage = message;
    }
    play(){
        console.log(this.recordedMessage);
    }
}

console.log(nomeTeste);
