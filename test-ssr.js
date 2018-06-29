var SSR = require('./dist/0.0.1/ssr-card.min.js')
var state = {
    "dataJSON": {
        "data": {
            "text":"<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>"
        },
        "mandatory_config": {}
    }
}
let x = SSR.render(state)
console.log(x.content)