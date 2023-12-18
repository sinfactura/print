
import './index.css';
import { wssHandler } from './helpers/renderer/wssHandler';
import { printersHandler } from './helpers/renderer/printersHandler';
import { loginHandler } from './helpers/renderer/loginHandler';

printersHandler();
wssHandler();

loginHandler();
