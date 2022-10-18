const Session = window.sessionStorage
const Local = window.localStorage

module.exports = {
    session: {
        set: function(name, data) {
            Session.setItem(name, JSON.stringify(data))
        },
        get: function(name) {
            return JSON.parse(Session.getItem(name))
        },
        remove: function(name) {
            Session.removeItem(name)
        },
        clear: function() {
            Session.clear()
        }
    },
    local: {
        set: function(name, data) {
            Local.setItem(name, JSON.stringify(data))
        },
        get: function(name) {
            return JSON.parse(Local.getItem(name))
        },
        remove: function(name) {
            Local.removeItem(name)
        },
        clear: function() {
            Local.clear()
        }
    }
}