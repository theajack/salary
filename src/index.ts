import hello from './demo';
import {b, fn} from './a';

const main = () => {
    window.console.log(hello);
    window.alert(hello);
    [1, 2, 3].forEach((num) => {
        window.console.log(num);
    });
    class a {

    }
    console.log(new a(), b, fn());
};


main();