
import './index.css';
import { wsHandler } from './helpers/renderer/wsHandler';
import { printersHandler } from './helpers/renderer/printersHandler';

printersHandler();
wsHandler();