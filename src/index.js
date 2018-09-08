const AWS = require('aws-sdk');
const ClashesTable = `cryptomon-clashes-staging`;
const EventTable = `cryptomon-events-staging`;
const documentClient = new AWS.DynamoDB.DocumentClient({region:'eu-west-3'});
const parserTeam = require('./parserTeam.js');

exports.handler = (event, context, callback) => {
    const team=[];
    for(i=0; i<20; i++){team.push("")};
    const data = {
        clashId: "ciaomare",
        _attacker: "0x65f56b50b3ac0f034970e2a26d12e090fa44065b",
        _defender: "0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e",
        _team1: parserTeam(team.map(()=>Math.random(10,20))),
        _team2: parserTeam(team.map(()=>Math.random(10,20))),
        bonusWinner: 1,
        _winnerId: 1,
        _moneyWon: 1000
    };

//     // const { Records } = event;
//     // const [data] = Records;
//     // const { body } = data;
//     // body = JSON.parse(body);
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
                            'user': data.attacker
                            'opponent': data.defender,
                            'userTeam': data._team1.toString(),
                            'opponentTeam': data._team2.toString(),
                            'bonusWinner': data.bonusWinner,
                            'result': (data._winnerId === 1)? 'won':(data._winnerId === 2)? 'lost': 'drawn',
                            'bet': data.bet
                        },
                    },
                    'PutRequest': {
                        'Item': {
                            'clashId': data.clashId,
                            'user': data.defender,
                            'opponent': data.attacker,
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
    }).promise(),
//
//     //promise che aggiorna la table events segnando l'evento come
    documentClient.put({
        TableName: EventTable,
        Item: {
            'transactionId': data.clashId,
            'type': 'clashId',
            'processed': true
        }
    }).promise()
])
    .then(() => callback(null, event))
    .catch(console.error);
}
