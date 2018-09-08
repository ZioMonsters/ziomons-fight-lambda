const AWS = require('aws-sdk');
const ClashesTable = `cryptomon-clashes-staging`;
const EventTable = `cryptomon-events-staging`;
const documentClient = new AWS.DynamoDB.DocumentClient({region:'eu-west-3'});

exports.handler = (event, context, callback) => {

 const data = JSON.parse(event.Records[0].body);
//     // const { clashId, _attacker: attacker, _defender: defender, firstTeam: _team1, secondTeam: _team2, bonusWinner: _bonusWinner, winner: _winnerId, bet: _moneyWon } = body;
  Promise.all([
//     // promise che scrive nella table la battaglia (partition key = clashId, sortKey = user)
//     // Results(msg.sender, _defender.addr, _team1, _team2,  uint8(params[11]), _winnerId, _moneyWon)
    documentClient.batchWrite({
        RequestItems: {
            [ClashesTable]: [
                    {
                        'PutRequest': {
                            'Item': {
                                'clashId': data.clashId,
                                'user': data._attacker,
                                'opponent': data._defender,
                                'userTeam': data._team1,
                                'opponentTeam': data._team2,
                                'bonusWinner': data.bonusWinner,
                                'result': (data._winnerId === 1)? 'won':(data._winnerId === 2)? 'lost': 'drawn',
                                'bet': data.bet
                            }
                        }
                    },
                    {
                    'PutRequest': {
                        'Item': {
                            'clashId': data.clashId,
                            'user': data._defender,
                            'opponent': data._attacker,
                            'userTeam': data._team2.toString(),
                            'opponentTeam': data._team1.toString(),
                            'bonusWinner': data.bonusWinner,
                            'result': (data._winnerId === 2)? 'won':(data._winnerId === 'lost')? 2: 'drawn',
                            'bet': data.bet
                        }
                    }
                }
            ]
        }
    }).promise()
    .catch(console.error),

    documentClient.put({
        TableName: EventTable,
        Item: {
            transactionId: data.clashId,
            type: 'clash',
            processed: true
        }
    }).promise().catch(console.error)
])
    .then(() => callback(null, event))
    .catch(console.error);
}
