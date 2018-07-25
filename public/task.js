let d3 = require('d3')
let remote = require('electron').remote
let monitor = require('active-window')
let sprintf = require('sprintf-js').sprintf

let refreshTime = 5000
let refreshInterval

let totalTime = 0
let appTimes = {}
let appList = []

let TaskModule = {
    view: function() {
        return m('table.table.table-striped.table-condensed', {
            style: {
                position: 'absolute',
                left: '300px',
                'top': '0px',
                width: '300px'
            }
        }, appList.map(app => {
            return m('tr', [
                m('td', [
                    m('div.progress-bar.progress-bar-striped.text-left', {
                        role: 'progressbar',
                        'aria-valuenow': app.percent,
                        'aria-valuemin': 0,
                        'aria-valuemax': appList[0].percent,
                        style: {
                            width: (100 * (app.percent / appList[0].percent)) + '%'
                        }
                    }, m('span', {
                        style: {
                            'padding-left': '5px'
                        }
                    }, '%'))//sprintf('%5.1f %%', app.percent)))
                ]),
                m('td', app.name)
            ])
        }))
    }
}

let compareTimes = (a, b) => b.time - a.time

let updateAppTimes = function(win) {
    if (!remote.getGlobal('isTimerActive')()) {
        return
    }

    if (!(win.app in appTimes)) {
        appTimes[win.app] = {name: win.app, time: 0, percent: 0}
    }

    totalTime += refreshTime

    appTimes[win.app].time += refreshTime

    for (app in appTimes) {
        appTimes[app].percent = 100 * appTimes[app].time / totalTime
    }

    let newAppList = []
    for (app in appTimes) {
        newAppList.push(appTimes[app])
    }

    newAppList.sort(compareTimes)
    appList = newAppList

    m.redraw(true)
}

exports.setup = function(element) {
    m.mount(element, TaskModule)
    refreshInterval = d3.interval(() => monitor.getActiveWindow(updateAppTimes), refreshTime)
}

