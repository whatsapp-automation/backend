import express from "express";
import cors from "cors";
import { listChats, searchContacts } from "./functions";

const app = express();
app.use(express.json());
app.use(cors());

//get all the contacts.
app.post("/contacts" , async(req , res) => {
    //get the contatcs asocaited with the user mcp>
    //for fetching all the contacts query is empty
    try {
        const body = req.body;
        const query = body.query;
        if(query == ''){
            console.log("fetching all contacts!!");
        }
        const contacts = await searchContacts(query);
        if(!contacts || contacts.length === 0) {
            res.status(404).json({
                error : "No contacts found"
            });
        }
        //else
        res.status(200).json({
            message : "contacts fetched successfully!!",
            contacts : contacts
        });
    } catch(error) {
        console.error("Error fetching contacts" , error);
        res.status(500).json({error: "Internal server error"});
    }
});

//get all the chats.
app.post("/get-all-chats" , async (req , res) => {
    try {
        const body = req.body;
        const query = body.query;
        const chats = await listChats(query);
        if(!chats || chats.length === 0) {
            res.status(404).json({
                error : "No chats found"
            });
        }
        res.status(200).json({
            message : "chats fetched successfully!!",
            chats : chats
        });
    } catch(error) {
        console.error("an error occured while fetching all the chats" , error);
        res.status(500).json({error : "Internal server error"});
    }
});

const PORT = 3002;

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});