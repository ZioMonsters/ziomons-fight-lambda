const AWS = require('aws-sdk');
const TableName = `cryptomon-clashes-${process.env.NODE_ENV}`;
const documentClient = new AWS.DynamoDB.DocumentClient();
const parserTeam = require('./parserTeam.js');

exports.handler = (event, context, callback) => {
    const team=[];
    for(i=0; i<20; i++){team.push("")};
    const data = {
        clashId: 314141414,
        _attacker: "0x65f56b50b3ac0f034970e2a26d12e090fa44065b",
        _defender: "0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e",
        _team1: parserTeam(team.map(()=>Math.random(10,20))),
        _team2: parserTeam(team.map(()=>Math.random(10,20))),
        bonusWinner: 1,
        _winnerId: 1,
        _moneyWon: 1000
    }

    //const { Records: [data]: body } = event;
    //const { clashId, _attacker: attacker, _defender: defender, firstTeam: _team1, secondTeam: _team2, bonusWinner: _bonusWinner, winner: _winnerId, bet: _moneyWon } = body;
  Promise.all([
    // promise che scrive nella table la battaglia (partition key = clashId, sortKey = user)
    // Results(msg.sender, _defender.addr, _team1, _team2,  uint8(params[11]), _winnerId, _moneyWon)
    documentClient.batchWrite({
        RequestItems: {
            TableName: [
                    {
                    PutRequest: {
                        Item: {
                            clashId,
                            user: attacker,
                            'myTeam': firstTeam,
                            'opponentTeam': secondTeam,
                            bonusWinner,
                            winner,
                            bet
                        },
                    },
                    PutRequest: {
                        Item: {
                            clashId,
                            user: defender,
                            'myTeam': secondTeam,
                            'opponentTeam': firstTeam,
                            bonusWinner,
                            winner: (_winnerId === 2)? 1:(_winnerId === 1)? 2: 0,
                            bet
                        }
                    }
                }
            ]
        }
    }).promise(
    ),
    documentClient.put({
        'TableName': 'events',
        Item: {
            eventId,
            'done': true
        }
    }).promise()
    // promise che aggiorna la table events segnando l'evento come
])
    .then(() => callback(null, event))
}
