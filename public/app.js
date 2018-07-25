var colorPrimary = '#375a7f'
var colorSecondary = '#444'
var colorSuccess = '#00bc8c'
var colorInfo = '#3498db'
var colorWarning = '#f39c12'
var colorDanger = '#e74c3c'

let m = require('mithril')

let timer = require('./timer')
let task = require('./task')

function setupApp() {
    timer.setup(document.getElementById('timerModule'))
    task.setup(document.getElementById('taskModule'))
}
