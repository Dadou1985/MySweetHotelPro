import { DatePicker, Space } from 'antd';

function onChange(date, dateString) {
  console.log(date, dateString);
}

ReactDOM.render(
  <Space direction="vertical">
    <DatePicker onChange={onChange} />
  </Space>,
  mountNode,
);