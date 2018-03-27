export class Record{
    status:boolean;
    sublevels:Array<boolean>;
    score:number;
    constructor(status){
        this.status=status;
        this.score=0;
        this.sublevels = new Array();
        Array.from(Array(30),(x,i)=>{
            this.sublevels[i]=false;
        });
    }
}