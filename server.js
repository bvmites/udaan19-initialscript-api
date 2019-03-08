const csvtojson=require('csvtojson')
const MongoClient = require("mongodb");
const httpRequest = require('request-promise-native');
require("request")

 const SMS_SENDER ='BVMSMS'
 const SMS_API_KEY = 'nQUvI2XjO3M-W9uZ3C5SJtuSb7J0oszstuigTazIfT';
 var SMS_TEST;

const sender = SMS_SENDER;
const apiKey = SMS_API_KEY;
var test = 'true'; 
MongoClient.connect("mongodb+srv://udaan18:udaan18@udaan18-dj1tc.mongodb.net/",(err,client)=>{
  if(err){
      return console.log("unable to connect")
  }
  var db= client.db("Udaan-19")

  const data = async function() {
    var res= await csvtojson().fromFile("./data.csv");
    res.forEach((event)=>{
    db.collection("events").findOne({eventName:event.EventName}).then((doc)=>{
      var numbers=doc.participants.join(",");

      doc.participants.forEach((participant)=>{ 
        db.collection('participants').updateMany({
            phone:participant,
            "events.eventName": doc.eventName
          },{
              $inc:{
                "events.$.round":1
              } 
          },{
              returnOriginal:false
          }).then((individual)=>{},(err)=>{})
        })      
        // TODO Default message
        const message = `Dear Participant, Round 1 of ${doc.eventName} is on ${event.Date} ${event.Time} at ${event.Venue}. Kindly be present at the venue on time.`;
        const apiRequest = {
            url: 'http://api.textlocal.in/send',
            form: {
              apiKey,
              numbers,
              test,
              sender,
              custom: doc.eventName,
              message,
              // receiptUrl: 'http://udaan18-messenger.herokuapp.com/textlocal'
            }
        };
        httpRequest.post(apiRequest).then((res)=>{
          var res1=JSON.parse(res);
          if (res1.status === 'success') {
            console.log("success : "+doc.eventName);         
          } else {
            console.log('error');
          }    
        });
      })
    })
  }

  data().catch((e)=>{
    console.log(e.message);
  })
  
})











            


        
