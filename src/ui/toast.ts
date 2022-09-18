/*
 * @Author: tackchen
 * @Date: 2022-09-18 22:29:08
 * @Description: Coding something
 */

let ToastContainer: HTMLDivElement;

export function toast (str: string, time = 2000) {
    if (!ToastContainer) {
        ToastContainer = window.document.createElement('div');
        ToastContainer.setAttribute('style', `
        position: fixed;
        left: 0;
        top: 0;
    `);
        window.document.body.appendChild(ToastContainer);
    }

    const span = window.document.createElement('span');
    span.setAttribute('style', `background-color: rgba(0,0,0,.8);
    padding: 3px 6px;
    border-radius: 3px;
    color: #fff;
    left: 50%;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);`);
    span.innerText = str;
    ToastContainer.appendChild(span);
    window.setTimeout(() => {
        ToastContainer.removeChild(span);
    }, time);
}
