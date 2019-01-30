import React from 'react'
import { withCookies } from 'react-cookie';

class Disclaimer extends React.Component {
  state = { ack: true }

  componentDidMount() {
    const ack = this.props.cookies.get('ack');
    if (!ack) {
      this.setState({ ack: false });
    }
  }

  dismiss = () => {
    this.props.cookies.set('ack', true, { path: '/' });
    this.setState({ ack: true })
  }

  render() {
    if (this.state.ack) return null;

    return (
      <div className="disclaimer">
        <span className="disclaimer-text">
          This website uses cookies to ensure you get the best experience on our
          website.&nbsp;
          <a className="disclaimer-link" href="https://www.iota.org/research/privacy-policy">Learn more</a>
        </span>
        <button className="button intro-button" onClick={this.dismiss}>Dismiss</button>
      </div>
    )
  }
}

export default withCookies(Disclaimer)
