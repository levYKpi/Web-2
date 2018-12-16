(function () {

   
    const CookieWorker = {

        get cookie() {
                if(document.cookie.length < 1)
                    return null;
                return document.cookie.split(';').reduce((acc, currentValue)=>{
                    let data = currentValue.split('=');
                    acc[data[0]] = data[1];
                    return acc;
                }, {});
        },

        set cookie(options) {
            if(!options.value && !options.name)
                return -1;
            if(options.parameters) {
                !options.parameters.path && (options.parameters.path = '/');

                let expires = (options.parameters.expires) ? options.parameters.expires : 3600;

                if (typeof expires == "number" && expires) {
                    let d = new Date();
                    d.setTime(d.getTime() + expires * 1000);
                    expires = options.parameters.expires = d;
                }
                if (expires && expires.toUTCString) {
                    options.parameters.expires = expires.toUTCString();
                }
            }

            let newCookie = `${options.name}=${options.value}; `;

            if(options.parameters) {
                for(let option in options.parameters) {
                   newCookie += `${option}=${options.parameters[option]}; `;
                }
            }

            return document.cookie = newCookie;
        },

        removeCookie(name) {
            this.cookie = {
                name: name,
                value: "",
                parameters: {expires: -1}
            }
        }

    };

    function fillOLWithCookis(DOMULElement) {
        if(!DOMULElement instanceof Node)
            return null;
        for(let elem in CookieWorker.cookie) {
            DOMULElement.innerHTML += `<li>${elem}: ${CookieWorker.cookie[elem]}<button id="${elem}">X</button></li>`;
            setTimeout(function () {
                document.getElementById(elem).addEventListener('click', ()=>{
                    CookieWorker.removeCookie(elem);
                    alert('Successfully removed');
                    location.reload();
                })
            }, 0)
        }
    }

    function addNewCookie() {
        let name = document.getElementById('cName').value;
        let val = document.getElementById('cVal').value;
        let time = parseInt(document.getElementById('cDate').value);
        let path = document.getElementById('cPath').value;
        let domain = document.getElementById('cDomain').value;

        let parameters = {};
        if(!isNaN(time))
            parameters.expires = time;
        if(path)
            parameters.path = path;
        if(domain)
            parameters.domain = domain;


        CookieWorker.cookie = {
            name:name,
            value:val,
            parameters: parameters
        };
        fillOLWithCookis(document.querySelector(".cookiesList"));
    }

    return (function () {
        fillOLWithCookis(document.querySelector(".cookiesList"));
        document.getElementById('cForm').addEventListener('submit', addNewCookie);
    })();

}());
