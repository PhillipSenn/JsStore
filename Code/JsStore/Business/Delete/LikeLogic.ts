namespace JsStore {
    export namespace Business {
        export namespace Delete {
            export class Like extends In {
                CompSymbol: Occurence;
                CompValue;
                Column;
                CompValueLength: Number;
                private filterOnOccurence = function (value) {
                    var Found = false;
                    value = value.toLowerCase();
                    switch (this.CompSymbol) {
                        case Occurence.Any: if (value.indexOf(this.CompValue) >= 0) {
                            Found = true;
                        }; break;
                        case Occurence.First: if (value.indexOf(this.CompValue) == 0) {
                            Found = true;
                        }; break;
                        default: if (value.lastIndexOf(this.CompValue) == value.length - this.CompValueLength) {
                            Found = true;
                        };
                    }
                    return Found;
                }

                protected executeLikeLogic = function (column, value, symbol: Occurence) {
                    var That = this,
                        Cursor: IDBCursorWithValue;
                    this.CompValue = (<string>value).toLowerCase();
                    this.CompValueLength = this.CompValue.length;
                    this.CompSymbol = symbol;
                    this.Column = column;
                    this.CursorOpenRequest = this._objectStore.index(column).openCursor();
                    this.CursorOpenRequest.onerror = function (e) {
                        That._errorOccured = true;
                        That.onErrorOccured(e);
                    }
                    if (That._checkFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.filterOnOccurence(Cursor.key) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    Cursor.delete();
                                    ++That._rowAffected;
                                }
                                Cursor.continue();
                            }
                        }
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.filterOnOccurence(Cursor.key)) {
                                    Cursor.delete();
                                    ++That._rowAffected;
                                }
                                Cursor.continue();
                            }
                        }
                    }
                }
            }
        }
    }
}