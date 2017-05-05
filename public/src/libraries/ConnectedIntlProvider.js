import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { defaultLocale, messages, getReactLanguageCode } from '../libraries/i18n.js';
// This function will map the current redux state to the props for the component that it is "connected" to.
// When the state of the redux store changes, this function will be called, if the props that come out of
// this function are different, then the component that is wrapped is re-rendered.
function mapStateToProps(state) {
    let language = state.getIn(['home', 'locale']);
    language = language === undefined ? defaultLocale : language;
    let localMessage = messages[language];
    let localeCode = getReactLanguageCode(language);
    return { key: "intl", locale: localeCode, messages: localMessage };
}

export default connect(mapStateToProps)(IntlProvider)
