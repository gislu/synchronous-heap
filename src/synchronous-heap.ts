import { MaxHeap } from './maxHeap';

export class SynchronousHeap {
    private _storeHeap : MaxHeap;
    //add a basis to make sure the heap is always in order
    private basis = 0;
    constructor() {
        this._storeHeap = new MaxHeap((operation:any) => operation.timeStamp);
    }
    push(data:any) {
        this.basis++;
        let timeStamp = new Date().getTime() + this.basis;
        let operation = {
            data: data,
            timeStamp: timeStamp
        }
        this._storeHeap.push(operation);
    }

    top() {
        return this._storeHeap.top().data;
    }
}

