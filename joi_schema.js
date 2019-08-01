const Joi = require('@hapi/joi');
Joi.makeTotalSchema = function(schema, rules) {
	Object.keys(rules).forEach(item => {
		var info = Joi.describe(rules[item]);
		if (info.type == 'alternatives') {
			const types = info.alternatives.map(item => item.type);
			if (types.indexOf('string')) {
				schema.define(item, 'string');
			} else {
				schema.define(item, types[0]);
			}
    }
    schema.define(item, info.type);
	});
};
