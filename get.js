const AWS = require("aws-sdk")

const dynomodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

module.exports.run = async (event) => {
    try{
      const data = event.multiValueQueryStringParameters.ids
      let keys = []

      data.forEach(item => {
          keys.push({"id": item})
      });

      const params = {
          RequestItems: {
            [TABLE_NAME] : {
                Keys: keys
            }
          }
      }

      let result = await dynomodb.batchGet(params).promise();
      
     return {
          statusCode: '200',
          body:  JSON.stringify(result.Responses[TABLE_NAME]),
          headers: {
              'Content-Type': 'application/json'
          }
      }
    }
    catch(e) {
        return {
            statusCode: '200',
            body:  JSON.stringify(`something happen ${e}`),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
}