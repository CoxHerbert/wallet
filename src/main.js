import { createApp } from 'vue';
import {
  Button,
  Calendar,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  ConfigProvider,
  DatetimePicker,
  Empty,
  Field,
  Form,
  Picker,
  Popup,
  Radio,
  RadioGroup,
  Rate,
  Slider,
  Stepper,
  Switch,
  Uploader,
} from 'vant';
import App from './App.vue';
import 'vant/lib/index.css';
import './styles/index.scss';

const app = createApp(App);

[
  Button,
  Calendar,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  ConfigProvider,
  DatetimePicker,
  Empty,
  Field,
  Form,
  Picker,
  Popup,
  Radio,
  RadioGroup,
  Rate,
  Slider,
  Stepper,
  Switch,
  Uploader,
].forEach((component) => {
  app.use(component);
});

app.mount('#app');
