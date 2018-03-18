export class Record{
    status:boolean;

    sublevels:Map<number,boolean>;

    score:number;

    constructor(status){

        this.status=status;

        this.score=0;

        this.sublevels = new Map();

        Array.from(Array(30),(x,i)=>{

            this.sublevels.set(i,false);

        });

    }

 

}