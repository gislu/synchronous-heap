 import { Heap } from './heap';

 const getMaxCompare = (getCompareValue : any) => (a : any, b : any) => {
   const aVal = typeof getCompareValue === 'function' ? getCompareValue(a) : a;
   const bVal = typeof getCompareValue === 'function' ? getCompareValue(b) : b;
   return aVal < bVal ? 1 : -1;
 };
 
 /**
  * @class MaxHeap
  * @extends Heap
  */
 export class MaxHeap {
   /**
    * @param {function} [getCompareValue]
    * @param {Heap} [_heap]
    */
  private _getCompareValue : any;
  private _heap : any;

   constructor(getCompareValue : any, _heap?: Heap) {
     this._getCompareValue = getCompareValue;
     this._heap = _heap || new Heap(getMaxCompare(getCompareValue));
   }
 
   /**
    * Inserts a new value into the heap
    * @public
    * @param {number|string|object} value
    * @returns {MaxHeap}
    */
   insert(value : any) {
     return this._heap.insert(value);
   }
 
   /**
    * Inserts a new value into the heap
    * @public
    * @param {number|string|object} value
    * @returns {Heap}
    */
   push(value : any) {
     return this.insert(value);
   }
 
   /**
    * Removes and returns the root node in the heap
    * @public
    * @returns {number|string|object}
    */
   extractRoot() {
     return this._heap.extractRoot();
   }
 
   /**
    * Removes and returns the root node in the heap
    * @public
    * @returns {number|string|object}
    */
   pop() {
     return this.extractRoot();
   }
 
   /**
    * Applies heap sort and return the values sorted by priority
    * @public
    * @returns {array}
    */
   sort() {
     return this._heap.sort();
   }
 
   /**
    * Fixes node positions in the heap
    * @public
    * @returns {MaxHeap}
    */
   fix() {
     return this._heap.fix();
   }
 
   /**
    * Verifies that all heap nodes are in the right position
    * @public
    * @returns {boolean}
    */
   isValid() {
     return this._heap.isValid();
   }
 
   /**
    * Returns the root node in the heap
    * @public
    * @returns {number|string|object}
    */
   root() {
     return this._heap.root();
   }
 
   /**
    * Returns the root node in the heap
    * @public
    * @returns {number|string|object}
    */
   top() {
     return this.root();
   }
 
   /**
    * Returns a leaf node in the heap
    * @public
    * @returns {number|string|object}
    */
   leaf() {
     return this._heap.leaf();
   }
 
   /**
    * Returns the number of nodes in the heap
    * @public
    * @returns {number}
    */
   size() {
     return this._heap.size();
   }
 
   /**
    * Checks if the heap is empty
    * @public
    * @returns {boolean}
    */
   isEmpty() {
     return this._heap.isEmpty();
   }
 
   /**
    * Clears the heap
    * @public
    */
   clear() {
     this._heap.clear();
   }
 
   /**
    * Returns a shallow copy of the MaxHeap
    * @public
    * @returns {MaxHeap}
    */
   clone() {
     return new MaxHeap(this._getCompareValue, this._heap.clone());
   }
 
   /**
    * Builds a MaxHeap from an array
    * @public
    * @static
    * @param {array} values
    * @param {function} [getCompareValue]
    * @returns {MaxHeap}
    */
   static heapify(values : any, getCompareValue : any) {
     if (!Array.isArray(values)) {
       throw new Error('MaxHeap.heapify expects an array');
     }
     const heap = new Heap(getMaxCompare(getCompareValue), values);
     return new MaxHeap(getCompareValue, heap).fix();
   }
 
   /**
    * Checks if a list of values is a valid max heap
    * @public
    * @static
    * @param {array} values
    * @param {function} [getCompareValue]
    * @returns {boolean}
    */
   static isHeapified(values : any, getCompareValue : any) {
     const heap = new Heap(getMaxCompare(getCompareValue), values);
     return new MaxHeap(getCompareValue, heap).isValid();
   }
 }
