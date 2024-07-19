import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;
  
    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      price_abc: 'float',
      price_def: 'float',
      ratio: 'float',
      upper_bound: 'float',
      lower_bound: 'float',
      trigger_alert: 'float',
      timestamp: 'date',
    };
  
    if (window.perspective && window.perspective.worker) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinct count',
        top_ask_price: 'avg',
        top_bid_price: 'avg',
        price_abc: 'avg',
        price_def: 'avg',
        ratio: 'avg',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'avg',
        timestamp: 'distinct count',
      }));
  
      elem.load(this.table);
    }
  }
  

  componentDidUpdate() {
    if (this.table) {
      this.table.update(this.props.data.map((el: any) => {
        return {
          stock: el.stock,
          top_ask_price: (el.top_ask && el.top_ask.price) || 0,
          top_bid_price: (el.top_bid && el.top_bid.price) || 0,
          price_abc: el.price_abc,
          price_def: el.price_def,
          ratio: el.ratio,
          upper_bound: el.upper_bound,
          lower_bound: el.lower_bound,
          trigger_alert: el.trigger_alert,
          timestamp: el.timestamp,
        };
      }));
    }
  }  
}

export default Graph;
