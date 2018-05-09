import React, { Component } from 'react';
import Autosuggester from 'react-autosuggest';
import { DataTable, TableBody, TableRow, TableColumn } from 'react-md';
import './styles.css';

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
    <DataTable plain>
      <TableBody>
        <TableRow key={suggestion.containerId}>
          <TableColumn>{suggestion.containerId}</TableColumn>
          <TableColumn className="md-text-center">
            {suggestion.departure} &rarr; {suggestion.destination}
          </TableColumn>
          <TableColumn className="md-text-right">{suggestion.status}</TableColumn>
        </TableRow>
      </TableBody>
    </DataTable>
  );

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search for containers',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggester
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        getSectionSuggestions={this.getSectionSuggestions}
        inputProps={inputProps}
      />
    );
  }
}

export default Autosuggest;
