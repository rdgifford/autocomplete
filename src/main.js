import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import _ from 'lodash';

// Configurations
const url = 'http://api.bing.com/osjson.aspx?JsonType=callback&JsonCallback=?';
const suggestionsLimit = 10;
const suggestionDebounceWait = 200;

class Suggestion extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <option value={this.props.value}/>
        )
    }
}

class AutoComplete extends React.Component {
    constructor(props) {
        super(props)
        this.updateSuggestions = _.debounce(this.updateSuggestions, suggestionDebounceWait)
        this.state = {
            suggestions: [],
            placeholderVisible: '',
            placeholderInvisible: '',
        }
    }
    resetSuggestions() {
        // if(_.some(this.state, stateValue => stateValue > 0)) {
            this.setState({
                suggestions: [],
                placeholderVisible: '',
                placeholderInvisible: '',
            })
        // }
    }
    updateSuggestions(event) {
        console.log('inside wrapper', event);
        let targetValue = event.target.value;

        this.resetSuggestions();
        $.getJSON(url, {
            query: targetValue
        }, data => {
            let suggestions = data[1];
            let suggestion, placeholder;

            // if(targetValue === $('input.autoComplete').val()) {
                if(suggestions.length > 0) {
                    placeholder = suggestions.shift();
                    suggestions = suggestions.slice(0, suggestionsLimit);

                    this.setState({
                        suggestions: suggestions,
                        placeholderVisible: placeholder.slice(targetValue.length),
                        placeholderInvisible: placeholder.slice(0, targetValue.length),
                    })
                }
            // }
        })
    }
    render() {
        return (
            <div className="autoComplete">
                <div className="logo">Autocomplete</div>
                <div className="textInput">
                    <div className="autoComplete placeHolder">
                        <span className="invisible">{this.state.placeholderInvisible}</span>
                        <span className="visible">{this.state.placeholderVisible}</span>
                    </div>
                    <input
                        className="autoComplete"
                        size="50"
                        list="d1"
                        onKeyDown={this.resetSuggestions.bind(this)}
                        onKeyUp={
                            event => {
                                event.persist()
                                this.updateSuggestions.call(this, event)
                            }
                        }
                    ></input>
                    <datalist id="d1"> { 
                        this.state.suggestions.map((suggestion, i) => {
                            return (
                                <Suggestion
                                    key={i}
                                    value={suggestion}
                                />
                            )
                        })
                    } </datalist>
                </div>
            </div>
        );
    }
}

$().ready(() => {
    ReactDOM.render(<AutoComplete />, $('.container')[0]);
});
