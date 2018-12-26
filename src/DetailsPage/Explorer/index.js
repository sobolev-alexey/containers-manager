import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import { fetch } from './MAM';
import List from './List';
import Loader from '../../SharedComponents/Loader';
import '../../assets/scss/explorer.scss';

class Explorer extends Component {
  state = {
    messages: [],
    showLoader: false,
  };

  appendToMessages = message => this.setState({ messages: [...this.state.messages, message] });

  fetchComplete = () => this.setState({ showLoader: false });

  startFetch = ({ mam: { root, secretKey } }) => {
    if (this.state.showLoader || root || secretKey) return;
    this.setState({ showLoader: true, messages: [] });
    fetch(root, secretKey, this.appendToMessages, this.fetchComplete);
  };

  render() {
    const { item, items, history, match: { params: { itemId } } } = this.props;
    if (!itemId || isEmpty(items)) {
      history.push('/');
    } else if (isEmpty(item) || item[0].containerId !== itemId) {
      this.startFetch(find(items, { itemId }));
    }
    const { showLoader } = this.state;
    return (
      <div className="explorer-content">
        <div className={`loaderWrapper ${showLoader ? '' : 'hidden'}`}>
          <Loader showLoader={showLoader} />
        </div>
        {item.length > 0 ? <List messages={item} /> : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  item: state.item,
  items: state.items.data,
});

export default connect(mapStateToProps)(withRouter(Explorer));
