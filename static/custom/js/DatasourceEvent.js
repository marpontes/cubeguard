function DatasourceEvent(sender) {
    this._sender = sender;
    this._listeners = [];
}

DatasourceEvent.prototype.attach = function (listener) {
    this._listeners.push(listener);
};

DatasourceEvent.prototype.notify = function (args) {
    var index;
    
    for (index = 0; index < this._listeners.length; index += 1) {
        this._listeners[index](this._sender, args);
    }
}