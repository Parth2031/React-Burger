import React, { Component } from 'react';
import Modal from '../../Components/UI/Modal/Modal';
import Auxiliary from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponents,axios) =>
{
  return class extends Component 
  {
    state = {
      error: null 
    }

    // componentDidMount()
    // {
    //   axios.interceptors.request.use(req =>
    //   {
    //     this.setState({ error: null });
    //     return req;
    //   });

    //   axios.interceptors.response.use( res => res, error => {
    //     this.setState({ error: error });
    //   });
    // }

  // ! We used this Lifecycle Hook as we know that componentDidMount runs after rendering of Child Components and we want to run before it. 

    _tempcomponentWillMount()
    {
      this.reqInterceptor = axios.interceptors.request.use( req =>
      {
        this.setState({ error: null });
        return req;
      });

      this.resInterceptor = axios.interceptors.response.use( res => res, error => {
        this.setState({ error: error });
      });
    }

  // ! We used this because in order to avoid unnecessary axios calls for multiple pages as this removes axios interceptors after Mounting is over.
    // * It is a cleanup function.  
    
    componentWillUnmount()
    {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    }

    render()
    {
     return (
       <Auxiliary>
         <Modal
           show={this.state.error}
           modalClosed={this.state.errorConfirmedHandler}>
           {this.state.error ? this.state.error.message : null}
         </Modal>
         <WrappedComponents {...this.props}/>
       </Auxiliary>
     );
    } 
  }
}

export default withErrorHandler;