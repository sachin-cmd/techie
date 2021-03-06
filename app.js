const express=require('express');
const bodyParser=require('body-parser');
const graphqlHttp=require('express-graphql');
const {buildSchema}=require('graphql');
const app=express();
const mongoose=require('mongoose');
const Event=require('./models/event');
const events=[]
app.use(bodyParser.json());
app.use('/graphql',graphqlHttp({
    schema: buildSchema(`
    type Event{
        _id:ID!
        title:String!
    }
    input EventInput{
        title:String!
    }
    type RootQuery{
        events:[Event!]!

    }
    type RootMutation{
        createEvent(eventInput:EventInput):Event

    }

    schema{
        query:RootQuery
        mutation:RootMutation
    }
`),

rootValue: {
    events:() => {
        return events;
    },
    createEvent:(args) => {
        // const event={
        //     _id:Math.random().toString(),
        //     title:args.eventInput.title
        // }
        const event=new Event({
            title:args.eventInput.title
        });
       return event.save()
        .then(result=>{
            console.log(result);
           return {...result._doc};
        })
        .catch(err=>{
            console.log(err);
            throw err;
        });
       
    }

},
graphiql:true

})
);
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-awsaa.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(()=>{
    app.listen(3000);

}).catch(err=>{
    console.log(err);
});


