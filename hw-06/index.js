var ListItem = /** @class */ (function () {
    function ListItem(value, _a) {
        var prev = _a.prev, next = _a.next;
        this.prev = null;
        this.next = null;
        this.value = value;
        if (prev && prev !== null) {
            this.prev = prev;
            prev.next = this;
        }
        if (next && next !== null) {
            this.next = next;
            next.prev = this;
        }
    }
    return ListItem;
}());
var LinkedList = /** @class */ (function () {
    function LinkedList() {
        this.first = null;
        this.last = null;
    }
    LinkedList.prototype.pushLeft = function (value) {
        var first = this.first;
        this.first = new ListItem(value, { next: first });
        if (this.last === null) {
            this.last = this.first;
        }
    };
    LinkedList.prototype.popLeft = function () {
        var _a = this, first = _a.first, last = _a.last;
        if (first === null || first === last) {
            this.first = null;
            this.last = null;
        }
        else {
            this.first = first.next;
            this.first.prev = null;
        }
        return first === null || first === void 0 ? void 0 : first.value;
    };
    LinkedList.prototype.pushRight = function (value) {
        var last = this.last;
        this.last = new ListItem(value, { prev: last });
        if (this.first === null) {
            this.first = this.last;
        }
    };
    LinkedList.prototype.popRight = function () {
        var _a = this, first = _a.first, last = _a.last;
        if (last === null || last === first) {
            this.first = null;
            this.last = null;
        }
        else {
            this.last === last.prev;
            this.last.next === null;
        }
        return last === null || last === void 0 ? void 0 : last.value;
    };
    return LinkedList;
}());
var linkedList = new LinkedList();
linkedList.pushRight(1);
linkedList.pushLeft(0);
linkedList.pushRight(2);
linkedList.pushRight(3);
linkedList.pushRight(4);
linkedList.pushRight(5);
linkedList.popLeft();
console.log(linkedList.first);
console.log(linkedList.last);
