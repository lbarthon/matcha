import React, { Component } from 'react';
import fr from '../../locales/fr.json';
import en from '../../locales/en.json';
import { withCurrentUserHOC } from './currentUser';
import req from './req';

export const locales = {
  fr: fr,
  en: en
}

const LocalesContext = React.createContext({
  locale: [],
  text: '',
  toggleLanguage : () => {},
  idParser : () => {}
});

class _LocalesProvider extends Component {

  state = {
    locale: locales['en'],
    text: 'en',
    loaded: false,
    toggleLanguage : () => {
      let newLang = (this.state.text === 'fr') ? 'en' : 'fr';
      this.setState({ locale: locales[newLang], text: newLang});
      req('/api/lang/set', {lang: newLang});
    },
    idParser : (str) => {
      console.log('erreur id :', str);
      let tab = str.split('.');
      let ret = this.state.locale;
      tab.forEach(value => {
        ret = ret[value];
      });
      return ret;
    }
  }

  componentWillMount() {
    req('/api/lang/get')
    .then(res => {
      console.log(res);
      this.setState({
        locale: locales[res],
        text: res,
        loaded: true
      });
    })
  }

  render() {
    if (this.state.loaded === false) return null;
    return (
      <LocalesContext.Provider value={this.state}>
        {this.props.children}
      </LocalesContext.Provider>
    )
  }
}

export const LocalesProvider = withCurrentUserHOC(_LocalesProvider);

export const withLocalesHOC = Component => {
  class HOC extends React.Component {
    render() {
      return <Component {...this.props} locales={this.context}/>
    }
  }
  HOC.contextType = LocalesContext;
  return HOC;
}
