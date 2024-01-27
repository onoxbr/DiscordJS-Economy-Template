DiscordJS Economy Template 🌟
=============================

This repository is a basic template for creating a Discord bot with economy functionalities. It includes commands to perform economic actions within your Discord server.

How to Use
----------

1.  Clone the repository using the following command:
    
    `git clone https://github.com/onoxbr/DiscordJS-Economy-Template.git`
    
2.  Install the necessary dependencies: 
    `npm install`
    
3.  Configure the `.env` file with the following variables:
   ```# Bot token
TOKEN=               

# MongoDB URI
MONGO_URI=          

# Application ID
CLIENT_ID=    

# Your ID
OWNER_ID=
```
    
4.  Start the bot using:   
    `node index.js`
    

Commands
--------

*   **daily**: Receive your daily reward.
*   **atm**: View your wallet.
*   **pay**: Pay a specified amount to another user.
*   **work**: Work to earn money.

Database
--------

This template uses MongoDB as the database to store information about users and their economic transactions.