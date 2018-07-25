let d3 = require('d3')
let remote = require('electron').remote

let timerComponent

let svg
let timerCase

let lastTime = 0
let timeElapsed = 0

let timerActive = false
let timerInterval

let scale = d3.scaleLinear().
    range([0, 360])

let secondHandSettings = {
    width: 1,
    strokeWidth: 3,
    length: 92,
    color: colorWarning,
    get: x => x / 1000,
    scale: scale.copy().domain([0, 60])
}

let minuteHandSettings = {
    width: 3,
    strokeWidth: 5,
    length: 70,
    color: colorInfo,
    get: x => x / (60 * 1000),
    scale: scale.copy().domain([0, 60])
}

let hourHandSettings = {
    width: 9,
    strokeWidth: 7,
    length: 50,
    color: colorSuccess,
    get: x => x / (60 * 60 * 1000),
    scale: scale.copy().domain([0, 12])
}

let TimerModule = {
    view: function() {
        return m('div', [
            m('span.lead', {
                style: {
                    '-webkit-touch-callout': 'none',
                    '-webkit-user-select': 'none',
                    '-user-select': 'none',
                    position: 'fixed',
                    bottom: '10px',
                    right: '310px',
                    color: '#fff',
                }
            }, getTimeString(timeElapsed)),
            createTimerGraphic(),
            createControlButtons()
        ])
    }
}

let createLine = d3.line().
    x(d => d[0]).
    y(d => d[1]).
    curve(d3.curveLinear)

let getTimeString = function(milliseconds) {
    let seconds = Math.floor((milliseconds / 1000) % 60)
    let minutes = Math.floor((milliseconds / (60 * 1000)) % 60)
    let hours = Math.floor(milliseconds / (60 * 60 * 1000))

    seconds = (seconds < 10)? '0' + seconds : '' + seconds
    minutes = (minutes < 10)? '0' + minutes : '' + minutes
    hours = '' + hours

    return hours + " : " + minutes + " : " + seconds
}

let getNeedleData = function(data) {
    let wa = data.width,
        wb = data.width * 3,
        lb = data.length / 5,
        la = data.length - lb

    return [
        [0, -data.length],
        [0, data.length / 5]
    ]
}

let createTimerGraphic = function() {
    return m('svg', {
        style: {
            position: 'fixed',
            left: '0',
            right: '0'
        },
        width: '300px',
        height: '300px'
    }, [
        createTickMarks(),
        m('circle', {
            cx: '150px',
            cy: '150px',
            r: '100px',
            stroke: '#ffffff',
            fill: 'none',
            'stroke-width': '10px'
        }),
        m('circle', {
            cx: '150px',
            cy: '150px',
            r: '8px',
            stroke: 'none',
            fill: colorPrimary,
            'stroke-width': 'none'
        }),

        createNeedle(hourHandSettings),
        createNeedle(minuteHandSettings),
        createNeedle(secondHandSettings)
    ])
}

let createTickMarks = function(angle) {
    let tickMark = angle => m('line', {
        y1: 80,
        y2: 100,
        transform: 'rotate(' + angle + ')',
        fill: colorPrimary,
        stroke: colorPrimary,
        'stroke-width': 4,
        'stroke-linecap': 'round'
    })

    return m('g', {
        transform: 'translate(150, 150)'
    }, [
        tickMark(0),
        tickMark(30),
        tickMark(60),
        tickMark(90),
        tickMark(120),
        tickMark(150),
        tickMark(180),
        tickMark(210),
        tickMark(240),
        tickMark(270),
        tickMark(300),
        tickMark(330)
    ])
}

let createNeedle = function(settings) {
    let data = getNeedleData(settings)

    return m('g', {
        transform: 'translate(150, 150)'
    }, [
        m('path', {
            d: createLine(data),
            transform: 'rotate(' + settings.scale(settings.get(timeElapsed)) + ')',
            fill: settings.color,
            stroke: settings.color,
            'stroke-width': settings.strokeWidth,
            'stroke-linecap': 'round'
        })
    ])
}

let createControlButtons = function() {
    if (timerActive) {
        return m('button.btn.btn-sm.btn-danger.timerControlLeft', {
            onclick: toggleTimerActive
        }, 'Stop')
    } else {
        return m('button.btn.btn-sm.btn-success.timerControlLeft', {
            onclick: toggleTimerActive
        }, 'Start')
    }
}

let toggleTimerActive = function() {
    if (timerActive) {
        lastTime = timeElapsed
    }

    timerActive = !timerActive
    remote.getGlobal('setTimerActive')(timerActive)

    if (timerActive) {
        d3Timer = d3.interval(updateNeedles, 200)
    } else {
        d3Timer.stop()
    }

    m.redraw(true)
}

let updateNeedles = function(elapsed) {
    timeElapsed = elapsed + lastTime
    m.redraw(true)
}

exports.setup = function(element) {
    m.mount(element, TimerModule)
    setTimeout(toggleTimerActive, 1000)
}
