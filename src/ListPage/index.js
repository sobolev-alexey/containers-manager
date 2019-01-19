import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Col } from 'reactstrap';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'react-md';
import isEmpty from 'lodash/isEmpty';
import { storeItems } from '../store/items/actions';
import Tooltip from '../SharedComponents/Tooltip';
import Loader from '../SharedComponents/Loader';
import Header from '../SharedComponents/Header';
import Footer from '../SharedComponents/MiniFooter';
import Notification from '../SharedComponents/Notification';
import Autosuggest from './Autosuggest';
import '../assets/scss/index.scss';
import '../assets/scss/listPage.scss';

class ListPage extends Component {
  state = {
    showLoader: false,
  };

  componentDidMount() {
    const { project, user, history, items } = this.props;
    if (isEmpty(user) || isEmpty(project)) {
      history.push('/login');
    } else {
      if (isEmpty(items.data) && user.previousEvent) {
        this.setState({ showLoader: true });
        this.props.storeItems(user);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      items: { data, error },
    } = nextProps;
    if (error) {
      this.notifyError(error);
    }
    if (
      isEmpty(this.props.items.data) &&
      nextProps.user.previousEvent &&
      !this.props.user.previousEvent
    ) {
      this.setState({ showLoader: true });
      this.props.storeItems(nextProps.user);
    }
    if (!isEmpty(data) || !isEmpty(this.props.items.data) || this.props.user.previousEvent) {
      this.setState({ showLoader: false });
    }
  }

  notifyError = message => toast.error(message);

  render() {
    const {
      project,
      user,
      history,
      items: { data },
    } = this.props;
    const { showLoader } = this.state;

    if (!project || !project.listPage) return <div />;

    return (
      <div className="list-page">
        <Header ctaEnabled>
          <Col xs={4} className="heading">
            <span className="heading-text">
              Welcome to container tracking
            </span>
          </Col>
        </Header>
        {user.canCreateStream ? (
          <div className="cta-wrapper">
            <button className="button create-cta" onClick={() => history.push('/new')}>
              Create new {project.trackingUnit}
            </button>
          </div>
        ) : null}
        <Loader showLoader={showLoader} />
        <div className={`md-block-centered ${showLoader ? 'hidden' : ''}`}>
          <Autosuggest
            items={data}
            project={project}
            onSelect={item => history.push(`/details/${item.itemId}`)}
            trackingUnit={project.trackingUnit}
          />
          <DataTable plain>
            <TableHeader>
              <TableRow>
                {project.listPage.headers.map((header, index) => (
                  <TableColumn
                    key={header}
                    className={index === 1 ? 'md-text-center' : index === 2 ? 'md-text-right' : ''}
                  >
                    {header}
                  </TableColumn>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(item => (
                <TableRow
                  key={item.itemId}
                  onClick={() => this.selectContainer(item.itemId)}
                  className={classNames({
                    'users-container': item.itemId === cookies.get('containerId'),
                  })}
                >
                  {project.listPage.body.map((entry, index) => (
                    <TableColumn
                      key={`${item.itemId}-${index}`}
                      className={
                        index === 1 ? 'md-text-center' : index === 2 ? 'md-text-right' : ''
                      }
                    >
                      {typeof entry === 'string'
                        ? item[entry]
                        : entry.map(field => item[field]).join(' → ')}
                    </TableColumn>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </div>
        <Notification />
        <Footer />
        <Tooltip tooltip={tooltip} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.project,
  user: state.user,
  items: state.items,
});

const mapDispatchToProps = dispatch => ({
  storeItems: user => dispatch(storeItems(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListPage);
