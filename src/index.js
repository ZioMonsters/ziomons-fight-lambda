const AWS = require("aws-sdk")
const TableName = `cryptomon-clashes-${process.env.NODE_ENV}`

exports.handler = (event, context, callback) => {
  Promise.all([
    // promise che scrive nella table la battaglia (partition key = clashId, sortKey = user)
    // promise che aggiorna la table events segnando l'evento come fatto
  ])
    .then(() => callback(null, event))
}
