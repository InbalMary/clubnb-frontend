export const SHOW_MSG = 'show-msg'

function createEventEmitter() {
    const listenersMap = {}
    return {
        on(evName, listener) {
            listenersMap[evName] = (listenersMap[evName]) ? [...listenersMap[evName], listener] : [listener]
            return () => {
                listenersMap[evName] = listenersMap[evName].filter(func => func !== listener)
            }
        },
        emit(evName, data) {
            if (!listenersMap[evName]) return
            listenersMap[evName].forEach(listener => listener(data))
        }
    }
}

export const eventBus = createEventEmitter()

export function showUserMsg(msg) {
    eventBus.emit(SHOW_MSG, msg)
}

export function showSuccessMsg(txt, imgUrl = null) {
    showUserMsg({ txt, type: 'success', imgUrl })
}
export function showErrorMsg(txt, imgUrl = null) {
    showUserMsg({ txt, type: 'error', imgUrl })
}

window.showUserMsg = showUserMsg