/*
 * @Author: tackchen
 * @Date: 2022-09-19 08:45:06
 * @Description: Coding something
 */
export const formatTime = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return (
        [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
    );
};

const formatNumber = (n: number) => {
    const s = n.toString();
    return s[1] ? s : '0' + s;
};
