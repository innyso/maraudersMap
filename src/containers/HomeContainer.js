import React from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { registerWizard } from '../redux/home';

const HomeContainer = () => (
  <Home
    error={this.props.error}
    isRegistering={this.props.isRegistering}
    onPress={this.props.dispatchRegisterWizard}
  />
);

const mapStateToProps = state => ({
  error: state.newWizard.error,
  isRegistering: state.newWizard.isRegistering,
});

const mapDispatchToProps = dispatch => ({
  dispatchRegisterWizard: keyword => dispatch(registerWizard(keyword)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
