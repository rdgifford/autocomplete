import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import _ from 'lodash';

class AutoComplete extends React.Component {
    render() {
        return (
            <div className="autoComplete">
                <div className="logo">Autocomplete</div>
                <div className="textInput">
                    <div className="autoComplete placeHolder">
                        <span className="invisible"></span>
                        <span className="visible"></span>
                    </div>
                    <input className="autoComplete" size="50" list="d1"></input>
                    <datalist id="d1"></datalist>
                </div>
            </div>
        );
    }
}

$().ready(() => {
    const url = 'http://api.bing.com/osjson.aspx?JsonType=callback&JsonCallback=?';
    let limit = 10;
    let container = $('.container')[0];

    ReactDOM.render(<AutoComplete />, container);

    let resetAutocomplete = event => {
        $('span.invisible').text('');
        $('span.visible').text('');
        $('#d1').empty();
    }

    let updateAutocomplete = event => {
		let targetValue = event.target.value;

        resetAutocomplete();
		$('span.invisible').text(targetValue);

        $.getJSON(url, {
            query: targetValue
        }, data => {
            let suggestions = data[1];
            let currLimit, suggestion, option;
            if(targetValue === $('input.autoComplete').val()) {

                if(suggestions.length > 0) {
                    $('span.visible').text(suggestions.shift().slice(targetValue.length));

                    currLimit = data[1].length < 10 ? data[1].length : limit;
                    for(let i = 0; i < currLimit; i++) {
                        suggestion = data[1][i];
                        option = $('<option>');
                        $('#d1').append(option.attr('value', suggestion));
                    }
                }
            }
        })
    };

    $('.autoComplete').keydown(resetAutocomplete)
    $('input.autoComplete').keyup(_.debounce(updateAutocomplete, 200));
});
