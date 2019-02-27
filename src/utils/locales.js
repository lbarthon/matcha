import React, { Component } from 'react';
import fr from '../../locales/fr.json';
import en from '../../locales/en.json';

const locales = {
  fr: fr,
  en: en
}

export const LocalesContext = React.createContext({
  locale: [],
  text: '',
  toggleLanguage : () => {},
  idParser : () => {}
});

export class LocalesProvider extends Component {

  state = {
    locale: locales['en'],
    text: 'en',
    loaded: false,
    toggleLanguage : () => {
      let newLang = (this.state.text === 'fr') ? 'en' : 'fr';
      this.setState({ locale: locales[newLang], text: newLang});
      fetch('/api/lang/set', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: "lang=" + newLang
      })
    },
    idParser : (str) => {
      console.log(str);
      let tab = str.split('.');
      let ret = this.state.locale;
      tab.forEach(value => {
        ret = ret[value];
      });
      return ret;
    }
  }

  componentWillMount() {
    fetch('/api/lang/get')
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          this.setState({
            locale: locales[json.lang],
            text: json.lang,
            loaded: true
          });
        });
      }
    });
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

export const withLocalesHOC = Component => {
  class HOC extends React.Component {
    render() {
      return <Component {...this.props} locales={this.context}/>
    }
  }
  HOC.contextType = LocalesContext;
  return HOC;
}
