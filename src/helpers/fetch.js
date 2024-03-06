import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import qs from "qs";
import Router from "../router";
import fakeBackEnd from "./fake-backend";

class Fetch {
    constructor() {
        this.options = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
    }

    // Fetch
    static make() {
        return new Fetch();
    }
    
    // Get method
    async get(
        url,
        arg = {
            loop: 3,
            query: {},
            authHeader: false,
        }
    ) {
        
        delete this.options.body;

        this.options.method = "GET";

        let { loop, authHeader, query } = arg;

        loop = parseInt(loop, 10);
        if (isNaN(loop)) {
            loop = 3;
        }
        if (authHeader) {

            this.options.headers["Authorization"] = this.authHeader();

        }


        let _qs = qs.stringify(query);
        if (!_isEmpty(_qs)) {
            url += `?${_qs}`;
        }

        for (let i = 1; i <= loop; i++) {
            try {
                let response = await this.fetch(url, this.options);
                let result = await this.parseJsonReponse(response);

                return result;
            } catch (err) {
                if (i === loop) {
                    throw new Error(err.message);
                }
            }
        }
    }

    // Post method
    async post(
        url, 
        body, 
        arg = {
            authHeader: false,
        }
    ) {
        if( "development" === process.env.NODE_ENV )
        {
            return fakeBackEnd.post(url, body)
        }
        
        const typeArg = typeof arg;
        if (typeArg != "object") 
        {
            throw new Error("argument must be object");
        }

        this.options.body = JSON.stringify(body);

        if (_get(arg, "authHeader") == true) {
            this.options.headers["Authorization"] = this.authHeader();
        }

        try 
        {
            let response = await this.fetch(url, this.options);
            let result = await this.parseJsonReponse(response);
            return result;
        } 
        catch (err) 
        {
            throw new Error(err.message);
        }
    }

    // Put method
    async put(url, body, arg = { authHeader: false }) {
        this.options.method = "PUT";

        if( "development" === process.env.NODE_ENV )
        {
            return fakeBackEnd.put(url, body)
        }

        const typeArg = typeof arg;
        if (typeArg != "object") {
            throw new Error("argument must be object");
        }

        this.options.body = JSON.stringify(body);

        if (_get(arg, "authHeader") == true) {
            this.options.headers["Authorization"] = this.authHeader();
        }

        try {
            let response = await this.fetch(url, this.options);
            let result = await this.parseJsonReponse(response);

            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Delete method
    async delete(url, arg = { authHeader: false }) {
        delete this.options.body;
        this.options.method = "DELETE";

        const typeArg = typeof arg;
        if (typeArg != "object") {
            throw new Error("argument must be object");
        }

        if (_get(arg, "authHeader") == true) {
            this.options.headers["Authorization"] = this.authHeader();
        }

        try {
            let response = await this.fetch(url, this.options);
            let result = await this.parseJsonReponse(response);

            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Download file
    async download(
        url,
        arg = { filename: "", type: "", authHeader: false }
    ) {
        this.options.method = "GET";

        const typeArg = typeof arg;
        if (typeArg != "object") {
            throw new Error("argument must be object");
        }

        const { filename, type, authHeader } = arg;

        if (authHeader == true) {
            this.options.headers["Authorization"] = this.authHeader();
        }

        if (type != undefined) {
            this.options.headers["Accept"] = type;
            this.options.headers["Content-Type"] = type;
        }

        try {
            let response = await this.fetch(url, this.options);
            let blob = await this.parseBlob(response);

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;

            document.body.append(link);

            link.click();
            link.remove();

            setTimeout(() => URL.revokeObjectURL(blob), 7000);

            return true;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Open file
    async open(url, arg = { type: "", authHeader: false }) {
        this.options.method = "GET";

        const typeArg = typeof arg;
        if (typeArg != "object") {
            throw new Error("argument must be object");
        }

        const { type, authHeader } = arg;

        if (authHeader == true) {
            this.options.headers["Authorization"] = this.authHeader();
        }

        if (type != undefined) {
            this.options.headers["Accept"] = type;
            this.options.headers["Content-Type"] = type;
        }

        try {
            let response = await this.fetch(url, this.options);
            let blob = await this.parseBlob(response);

            let fileUrl = URL.createObjectURL(blob);

            setTimeout(() => URL.revokeObjectURL(blob), 7000);

            return fileUrl;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Fetch data
    async fetch(url, options) {
        let response = await fetch(url, options);

        return response;
    }
    // Parse JSON reponse
    async parseJsonReponse(response) {
        if (response.status == 401 || response.code == 400) {
            localStorage.clear();
            sessionStorage.clear();
            Router.replace({ name: "login" });
            return; 
        }

        let text = await response.text();
        const data = text && JSON.parse(text);

        if (401 == data.code) {
            let currentRouteName = _get(Router, "history.current.name");
            if ("login" != currentRouteName) {
                localStorage.clear();
                sessionStorage.clear();
                
                Router.replace({ name: "login" });
            }

            return;
        }

        return data;
    }

    // Parse Blob
    async parseBlob(response) {
        if (!response.ok || response.status == 401) {
            let currentRouteName = _get(Router, "history.current.name");
            if (currentRouteName != "home") {
                Router.replace({ name: "home" });
            }

            return;
        }

        let blob = await response.blob();
        return blob;
    }
    
    authHeader()
    {
        return 'Bearer ' + _get(JSON.parse(localStorage.getItem('GURUB-TOKEN')),'access_token')
    }
}

export default Fetch;
