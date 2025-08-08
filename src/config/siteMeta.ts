import { Metadata } from 'next';
import config from './index';

const siteMeta: Metadata = {
  title: config.app_name,
  description: config.description,
  keywords: config.keywords,
};

export default siteMeta;
