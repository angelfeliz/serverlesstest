const AWS = require("aws-sdk")
const uuid = require("uuid/v4")

const dynomodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

module.exports.run = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const params = {
            TableName: [TABLE_NAME],
            Item:{ ...userParams(data) }
        }
        await dynomodb.put(params).promise();

        return {
            statusCode: '200',
            body: JSON.stringify(data)
        }
    }
    catch(e){
        return {
            statusCode: '404',
            body: JSON.stringify({msg: `Something happen ${e}`})
        }
    }
}

module.exports.bulk = async (event) => {
    try {
        const data = JSON.parse(event.body)
        const params = {
            RequestItems: {
                [TABLE_NAME]: constructBulkItems(data)
            }
        }
        let result = await dynomodb.batchWrite(params).promise();

        return {
                statusCode: '200',
                body:  JSON.stringify(result),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
    }
    catch(e) {
       return {
            statusCode: '404',
            body: JSON.stringify('Somenthing happen ', e)
        }
    }
}

function userParams(data) {
    return {
         id: uuid(),
         name: data.name,
         lastName: data.lastName,
         position: data.position,
         creatAt: Date.now()
    }
}

function constructBulkItems(data = []) {
    let users = [];
     data.forEach(item => {
        users.push({
            PutRequest: {
                Item: {
                    ...userParams(item) 
                }
            }
        })
     });
    return users;
}
