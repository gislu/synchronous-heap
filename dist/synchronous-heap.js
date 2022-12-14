'use strict';

/**
 * @license MIT
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 *
 * @class
 */
class Heap {
  _leaf;
  _compare;
  _nodes;
  constructor(compare, _values, _leaf) {
    if (typeof compare !== "function") {
      throw new Error("Heap constructor expects a compare function");
    }
    this._compare = compare;
    this._nodes = Array.isArray(_values) ? _values : [];
    this._leaf = _leaf || null;
  }
  _hasLeftChild(parentIndex) {
    const leftChildIndex = parentIndex * 2 + 1;
    return leftChildIndex < this.size();
  }
  _hasRightChild(parentIndex) {
    const rightChildIndex = parentIndex * 2 + 2;
    return rightChildIndex < this.size();
  }
  _compareAt(i, j) {
    return this._compare(this._nodes[i], this._nodes[j]);
  }
  _swap(i, j) {
    const temp = this._nodes[i];
    this._nodes[i] = this._nodes[j];
    this._nodes[j] = temp;
  }
  _shouldSwap(parentIndex, childIndex) {
    if (parentIndex < 0 || parentIndex >= this.size()) {
      return false;
    }
    if (childIndex < 0 || childIndex >= this.size()) {
      return false;
    }
    return this._compareAt(parentIndex, childIndex) > 0;
  }
  _compareChildrenOf(parentIndex) {
    if (!this._hasLeftChild(parentIndex) && !this._hasRightChild(parentIndex)) {
      return -1;
    }
    const leftChildIndex = parentIndex * 2 + 1;
    const rightChildIndex = parentIndex * 2 + 2;
    if (!this._hasLeftChild(parentIndex)) {
      return rightChildIndex;
    }
    if (!this._hasRightChild(parentIndex)) {
      return leftChildIndex;
    }
    const compare = this._compareAt(leftChildIndex, rightChildIndex);
    return compare > 0 ? rightChildIndex : leftChildIndex;
  }
  _compareChildrenBefore(index, leftChildIndex, rightChildIndex) {
    const compare = this._compareAt(rightChildIndex, leftChildIndex);
    if (compare <= 0 && rightChildIndex < index) {
      return rightChildIndex;
    }
    return leftChildIndex;
  }
  _heapifyUp(startIndex) {
    let childIndex = startIndex;
    let parentIndex = Math.floor((childIndex - 1) / 2);
    while (this._shouldSwap(parentIndex, childIndex)) {
      this._swap(parentIndex, childIndex);
      childIndex = parentIndex;
      parentIndex = Math.floor((childIndex - 1) / 2);
    }
  }
  _heapifyDown(startIndex) {
    let parentIndex = startIndex;
    let childIndex = this._compareChildrenOf(parentIndex);
    while (this._shouldSwap(parentIndex, childIndex)) {
      this._swap(parentIndex, childIndex);
      parentIndex = childIndex;
      childIndex = this._compareChildrenOf(parentIndex);
    }
  }
  _heapifyDownUntil(index) {
    let parentIndex = 0;
    let leftChildIndex = 1;
    let rightChildIndex = 2;
    let childIndex;
    while (leftChildIndex < index) {
      childIndex = this._compareChildrenBefore(
        index,
        leftChildIndex,
        rightChildIndex
      );
      if (this._shouldSwap(parentIndex, childIndex)) {
        this._swap(parentIndex, childIndex);
      }
      parentIndex = childIndex;
      leftChildIndex = parentIndex * 2 + 1;
      rightChildIndex = parentIndex * 2 + 2;
    }
  }
  insert(value) {
    this._nodes.push(value);
    this._heapifyUp(this.size() - 1);
    if (this._leaf === null || this._compare(value, this._leaf) > 0) {
      this._leaf = value;
    }
    return this;
  }
  push(value) {
    return this.insert(value);
  }
  extractRoot() {
    if (this.isEmpty()) {
      return null;
    }
    const root = this.root();
    this._nodes[0] = this._nodes[this.size() - 1];
    this._nodes.pop();
    this._heapifyDown(0);
    if (root === this._leaf) {
      this._leaf = this.root();
    }
    return root;
  }
  pop() {
    return this.extractRoot();
  }
  sort() {
    for (let i = this.size() - 1; i > 0; i -= 1) {
      this._swap(0, i);
      this._heapifyDownUntil(i);
    }
    return this._nodes;
  }
  fix() {
    for (let i = 0; i < this.size(); i += 1) {
      this._heapifyUp(i);
    }
    return this;
  }
  isValid() {
    const isValidRecursive = (parentIndex) => {
      let isValidLeft = true;
      let isValidRight = true;
      if (this._hasLeftChild(parentIndex)) {
        const leftChildIndex = parentIndex * 2 + 1;
        if (this._compareAt(parentIndex, leftChildIndex) > 0) {
          return false;
        }
        isValidLeft = isValidRecursive(leftChildIndex);
      }
      if (this._hasRightChild(parentIndex)) {
        const rightChildIndex = parentIndex * 2 + 2;
        if (this._compareAt(parentIndex, rightChildIndex) > 0) {
          return false;
        }
        isValidRight = isValidRecursive(rightChildIndex);
      }
      return isValidLeft && isValidRight;
    };
    return isValidRecursive(0);
  }
  clone() {
    return new Heap(this._compare, this._nodes.slice(), this._leaf);
  }
  root() {
    if (this.isEmpty()) {
      return null;
    }
    return this._nodes[0];
  }
  top() {
    return this.root();
  }
  leaf() {
    return this._leaf;
  }
  size() {
    return this._nodes.length;
  }
  isEmpty() {
    return this.size() === 0;
  }
  clear() {
    this._nodes = [];
    this._leaf = null;
  }
  static heapify(values, compare) {
    if (!Array.isArray(values)) {
      throw new Error("Heap.heapify expects an array of values");
    }
    if (typeof compare !== "function") {
      throw new Error("Heap.heapify expects a compare function");
    }
    return new Heap(compare, values).fix();
  }
  static isHeapified(values, compare) {
    return new Heap(compare, values).isValid();
  }
}

/**
 * @license MIT
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 */
const getMaxCompare = (getCompareValue) => (a, b) => {
  const aVal = typeof getCompareValue === "function" ? getCompareValue(a) : a;
  const bVal = typeof getCompareValue === "function" ? getCompareValue(b) : b;
  return aVal < bVal ? 1 : -1;
};
class MaxHeap {
  _getCompareValue;
  _heap;
  constructor(getCompareValue, _heap) {
    this._getCompareValue = getCompareValue;
    this._heap = _heap || new Heap(getMaxCompare(getCompareValue));
  }
  insert(value) {
    return this._heap.insert(value);
  }
  push(value) {
    return this.insert(value);
  }
  extractRoot() {
    return this._heap.extractRoot();
  }
  pop() {
    return this.extractRoot();
  }
  sort() {
    return this._heap.sort();
  }
  fix() {
    return this._heap.fix();
  }
  isValid() {
    return this._heap.isValid();
  }
  root() {
    return this._heap.root();
  }
  top() {
    return this.root();
  }
  leaf() {
    return this._heap.leaf();
  }
  size() {
    return this._heap.size();
  }
  isEmpty() {
    return this._heap.isEmpty();
  }
  clear() {
    this._heap.clear();
  }
  clone() {
    return new MaxHeap(this._getCompareValue, this._heap.clone());
  }
  static heapify(values, getCompareValue) {
    if (!Array.isArray(values)) {
      throw new Error("MaxHeap.heapify expects an array");
    }
    const heap = new Heap(getMaxCompare(getCompareValue), values);
    return new MaxHeap(getCompareValue, heap).fix();
  }
  static isHeapified(values, getCompareValue) {
    const heap = new Heap(getMaxCompare(getCompareValue), values);
    return new MaxHeap(getCompareValue, heap).isValid();
  }
}

class SYNCHRONOUSHEAP {
}
new MaxHeap((bid) => bid.value);

var index = {
  SynchronousHeap: SYNCHRONOUSHEAP
};

module.exports = index;
//# sourceMappingURL=synchronous-heap.js.map
