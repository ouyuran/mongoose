'use strict';

/*!
 * ignore
 */

module.exports = function(schematype) {
  if (schematype.$immutable) {
    schematype.$immutableSetter = createImmutableSetter(schematype.path,
      schematype.options.immutable);
    schematype.set(schematype.$immutableSetter);
  } else if (schematype.$immutableSetter) {
    schematype.setters = schematype.setters.
      filter(fn => fn !== schematype.$immutableSetter);
    delete schematype.$immutableSetter;
  }
};

function createImmutableSetter(path, immutable) {
  return function immutableSetter(v) {
    if (this == null || this.$__ == null) {
      return v;
    }
    if (this.isNew) {
      return v;
    }

    const _immutable = typeof immutable === 'function' ?
      immutable.call(this, this) :
      immutable;
    if (!_immutable) {
      return v;
    }

    return this[path];
  };
}
