var SSR = require('./dist/0.0.1/ssr-card.min.js')
var state = {
    "dataJSON": {
        "data": {},
        "mandatory_config": {}
    }
}
SSR.render("col7", state)