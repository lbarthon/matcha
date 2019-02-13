import React, { Component } from 'react';
import fr from '../../locales/fr.json';
import en from '../../locales/en.json';

export const LocalesContext = React.createContext({
  locale: [],
  text: '',
  toggleLanguage : () => {}
});

export class LocalesProvider extends Component {

  locales = {
    fr: fr,
    en: en
  }

  state = {
    locale: this.locales.fr,
    text: 'fr',
    toggleLanguage : () => {
      if (this.state.text === 'fr')
        this.setState({ locale: this.locales['en'], text: 'en'})
      else
        this.setState({ locale: this.locales['fr'], text: 'fr'})
    }
  }

  render() {
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
      return (
        <Component {...this.props} locales={this.context}/>
      )
    }
  }
  HOC.contextType = LocalesContext;
  return HOC;
}
