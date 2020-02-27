// implement your API here
const express = require("express")
let users = require("./data/db")
const server = express()

const port = process.env.PORT || 4000

server.use(express.json())

server.get("/", (req, res) => {
    res.json({
        message: "Hello World!"
    })
})
//Gets users
server.get("/users", (req, res) => {
    users.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(() => {
        res.status(500).json({
            error: 'Failed to load users'
        })
    })
})

//gets users by id
server.get('/api/users/:id', (req, res) => {
    users.findById(req.params.id)
         .then( 
            user => {
        if (user){
            res.status(200).json(user);
        } else{ 
          res.status(404).json({
              errorMessage: "The user with the specified ID does not exist."
            })
        }
        
    })
    .catch(error => {
        console.log("error on GET /user", error);
        res
        .status(500)
        .json({errorMessage: "The user information could not be retrieved."});
    });  
});


//posts a user
server.post('/api/users', (req, res) => {
    users.insert(req.body)
    .then(user => {
        res.status(201).json(user);
    })
    .catch(error => {
        console.log("error on POST /user", error);
        res
        .status(400)
        .json({errorMessage: "Please provide name and bio for the user."});
    });

});

//deletes a user
server.delete("/users/:id", (req, res) => {
    users.remove(req.params.id)

    .then(user => {
        if(user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                errorMessage: "the user with the specified id does not exist"
            })
        }
    })
    .catch( () => {
        res.status(500).json({ 
            message: "The user could not be removed"
        })
    })
})

//puts a user
server.put('/api/users/:id', (req, res) => {
    users.update(req.params.id, req.body)
    .then(user => {
        if (!user){
            res
            .status(404)
            .json({errorMessage: "The user with the specified ID does not exist."})
        } else if ((req.body.name.length<1) || (req.body.bio.length<1)){
            res
            .status(400)
            .json({errorMessage:  "Please provide name and bio for the user." })
        } else {
           res.status(200).json(user); 
        }
    })
    .catch(() => {
        res
        .status(500)
        .json({errorMessage:  "The user information could not be modified."});
    });

});


// starting the server
server.listen(port, () => {
    console.log(`Server Started At http://localhost:${port}`)
})