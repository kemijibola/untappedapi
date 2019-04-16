const _ = require('lodash')
const { getDiff } = require('../../lib/docDiff');
const LogSchema = require('./log');

const plugin = function(schema) {

    schema.post('init', doc => {
        doc._original = doc.toObject({ transform: false })
    })

    schema.pre('save', function (next) {
        if (this.isNew) {
            next()
        } else {
            this._diff = getDiff(this, this._original)
            next()
        }
    })

    schema.methods.log = function (data) {
        data.diff = {
            before: this._original,
            after: this._diff,
        }
        return LogSchema.create(data)
    }
}

module.exports = plugin