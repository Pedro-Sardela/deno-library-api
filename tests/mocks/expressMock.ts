
export function mockRequest(overrides: any = {}) {
    return {
        body: {},
        params: {},
        query: {},
        headers: {},
        ...overrides
    };
}

export function mockResponse() {
    const res: any = {
        _status: 200,
        _data: null,

        status: function(code: number) {
            this._status = code;
            return this;
        },
        
        json: function(data: any) {
            this._data = data;
            return this;
        },
        send: function(data: any) {
            this._data = data;
            return this;
        },

        send_ok: function(message: string, data?: any) {
            this._status = 200;
            this._data = data !== undefined ? { message, data } : { message };
            return this._data; 
        },
        
        send_created: function(message: string, data?: any) {
            this._status = 201;
            this._data = data !== undefined ? { message, data } : { message };
            return this._data;
        },

        _getResult: function() {
            return this._data;
        },
        _getStatus: function() {
            return this._status;
        }
    };

    return res;
}

export function createMockNext() {
    let capturedError: any = null;
    
    const next = (err?: any) => {
        if (err) capturedError = err;
    };
    
    next.getError = () => capturedError;
    
    return next;
}