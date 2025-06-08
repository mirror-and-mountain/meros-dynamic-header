import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit.js';
import Save from './save.js';
import metadata from './block.json';

registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save: Save
} );
