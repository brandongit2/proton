import * as React from 'react';

export interface Props {
    name: string;
  }

export class Greeting extends React.Component<Props, object> {
    render() {
        return <h1>Hello, this is {this.props.name}</h1>
    }
}