import React from 'react';
import Link from 'umi/link';
import { Exception } from '@/widget';

const Exception500 = () => <Exception type="500" linkElement={Link} />;

export default Exception500;
