# bot-base

Voici un bot [Discord.js](https://discord.js.org/) très simple qui permet de commencer très facilement et rapidement.

## Initialisation

### 1. MongoDB

On utilisera MongoDB pour notre base de données car elle est très simple et une des plus connus.

Vous devrez donc créer compte sur [MongoDB](https://mongodb.com)

Une fois votre compte créé, vous devez faire un projet, ils y a de bonne chance qu'ils le soient déjà !
Vous pouvez ensuite venir cliquer sur le bouton de création de base de données ![Screen bouton création de base de données](https://imgur.com/jEwkluu.png)

Vous pouvez continuer en choisissant l'offre que vous désirer, la gratuite convient bien évidemment, ensuite vos logs et adresse ip pour finir.

Une fois le tout finis vous pouvez cliquer sur "Connect"

![Bouton Connect](https://imgur.com/89Cquax.png)

Ensuite sélectionner "Connect your application"

![Bouton Connect your application](https://imgur.com/Ie1iycf.png)

Vous pouvez enfin cliquer sur le bouton Copier/Coller

![Bouton Copier/Coller](https://imgur.com/gUseq2q.png)

Vous devrez remplacer ces chaines, présentes dans src/index.ts et src/deploy-commands.ts, par votre chaine copier/coller, n'oubliez pas de remplacer <password> par le mot de passe de votre user
![Chaine à remplacer](https://imgur.com/DozY60J.png)

Vous devrez aussi créer une base de données nommées discord_bot sur ce projet de la manière dont vous voulez (MongoShell, Mongo Compass, Studio 3T ...)

Elle possèdera une collection env avec 3 documents :

```
db.env.insertMany([
{field:"DISCORD_TOKEN",value:"<discord_token>"},
{field:"CLIENT_ID",value:"<bot_client_id>"},
{field:"GUILD_ID",value:"<private_server_guild_id>"}
])
```
NOTE : Le champ GUILD_ID sera utile pour vous uniquement car il s'agira du serveur pour exécuter des commandes qu'uniquement vous pouvez utiliser
