import React from 'react'
import { Cell } from 'fixed-data-table';
import styles from './FixedDataTable.css'

class CheckCell extends React.Component {
  render() {
    const {rowIndex, field_id, data, ...props} = this.props;
    return (
      <Cell {...props}>
      	<input type="checkbox" value={data.getObjectAt(rowIndex)[field_id]} style={{ cursor: "pointer" }} className={ "checkbox " + styles.input_checkbox } />
      </Cell>
    );
  }
}

class TextCell extends React.Component {
  render() {
    const {rowIndex, field_id, field, data, ...props} = this.props;
    return (
      <Cell {...props}>
        {data.getObjectAt(rowIndex)[field]}
      </Cell>
    );
  }
}

class LinkCell extends React.Component {
  render() {
    const {rowIndex, field, field_id, data, ...props} = this.props;
    const link = data.getObjectAt(rowIndex)[field];
    const href = '/admin/article_detail/' + data.getObjectAt(rowIndex)[field_id];
    return (
      <Cell {...props}>
        <a href={href}>{link}</a>
      </Cell>
    );
  }
}

class IsDeleteCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    const text = data.getObjectAt(rowIndex)[field] == 1 ? "已刪除" : "正常"
    return (
      <Cell {...props}>
        { text }
      </Cell>
    );
  }
}

module.exports = {CheckCell, TextCell, LinkCell, IsDeleteCell}