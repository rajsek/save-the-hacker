import Root from 'containers/App';
import MobileDetect from 'mobile-detect';
import arrayFrom from 'array-from';

//Array.from polyfill
Array.from = Array.from || arrayFrom;

const md = new MobileDetect(navigator.userAgent);
const is_mobile = md.mobile() !== null;
//Explicitly check  and activate HMR
if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(<Root />, document.getElementById('main'));

const touchClass = is_mobile ? 'touch' : 'nonTouch';

document.getElementById('main').classList.add(touchClass);
