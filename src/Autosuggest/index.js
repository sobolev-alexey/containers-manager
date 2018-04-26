import React, { Component } from 'react';
import Autosuggester from 'react-autosuggest';
import styles from './styles.css';

class Autosuggest extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };
  }

  // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
  escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  getSuggestions = value => {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return this.props.items.filter(container => {
      return (
        regex.test(container.shipper) ||
        regex.test(container.containerId) ||
        regex.test(container.departure) ||
        regex.test(container.destination) ||
        regex.test(container.status)
      );
    });
  };

  onChange = (event, { newValue, method }) => {
    this.setState({ value: newValue });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ suggestions: this.getSuggestions(value) });
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.onSelect(suggestion);
  };

  getSectionSuggestions = section => [section];

  getSuggestionValue = suggestion => suggestion.containerId;

  renderSuggestion = suggestion => (
    <div>
      <p>
        {suggestion.departure} &rarr; {suggestion.destination}
      </p>
      <p>{suggestion.status}</p>
    </div>
  );

  renderSectionTitle = section => <strong>IMO: {section.containerId}</strong>;

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggester
        multiSection
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        renderSectionTitle={this.renderSectionTitle}
        getSectionSuggestions={this.getSectionSuggestions}
        inputProps={inputProps}
      />
    );
  }
}

export default Autosuggest;
