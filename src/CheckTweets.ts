import { uri,twitterBearerToken } from "./env.json"
import { TwitterApi } from 'twitter-api-v2';
import { MongoClient } from "mongodb";
import { Client,EmbedBuilder,TextChannel,ActionRowBuilder,ButtonBuilder,ButtonStyle } from "discord.js";

export async function checkTweets(clientDiscord:Client){
    const clientMongo = new MongoClient(uri);
    const database = clientMongo.db('ubereats_discord_bot');
    const lastTweetCollection = database.collection('lastTweet');
    const lastTweet = await lastTweetCollection.findOne();

    const twitterClient = new TwitterApi(twitterBearerToken);
    const readOnlyClient = twitterClient.readOnly;
    const user = await readOnlyClient.v2.userByUsername('ubereats_fr');
    const ubereatstweets = await twitterClient.v1.userTimelineByUsername('ubereats_fr',{count:1,exclude_replies:true,include_rts:false});
    //Twitter v2 
    //const ubereatstweets = await readOnlyClient.v2.userTimeline(user.data.id, { exclude: 'replies',since_id:lastTweet?.tweetId,expansions:"referenced_tweets.id,author_id","tweet.fields":"created_at" });
    const allTweets = ubereatstweets.tweets.filter(tweet => /\s*code\s*/.test(tweet.text) || /\s*Compo\s*/.test(tweet.text));

    if(allTweets.length > 0 && allTweets[0].id != lastTweet?.tweetId){
        let lastTweetUberEats = allTweets[0];
        await lastTweetCollection.updateOne({},{$set:{tweetId:lastTweetUberEats.id}})
        const guildInfo = database.collection('guildinfo');
        const guilds = await (await guildInfo.find()).toArray();
        const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Redeem')
					.setStyle(ButtonStyle.Link)
                    .setURL("https://www.ubereats.com/ch/feed?diningMode=DELIVERY&mod=promos"),
			);

        const embed = new EmbedBuilder().setAuthor({name:"Uber Eats France (@ubereats_fr)",iconURL:"https://pbs.twimg.com/profile_images/1526507008505126912/KLpm9_UY_400x400.jpg",url:"https://twitter.com/ubereats_fr"}).setColor("#00c75f").setDescription(lastTweetUberEats.text).setFooter({text:"Twitter",iconURL:"https://cdn.cms-twdigitalassets.com/content/dam/developer-twitter/images/Twitter_logo_blue_48.png"}).setTimestamp(new Date(lastTweetUberEats?.created_at || Date.now()));
        
        for(let guild of guilds){
            if(guild.channelId && guild.roleId){
                clientDiscord.guilds.fetch(guild.guildId).then(discordGuild => {
                    discordGuild.channels.fetch(guild.channelId).then((channel) => {
                        if(channel?.isTextBased()){
                            let textChan:TextChannel = (channel as TextChannel);
                            textChan.send({ embeds:[embed],components:[row] })
                            textChan.send({ content:guild.roleId ? `<@&${guild.roleId}>` : "New Uber Eat Tweets" })
                        }
                    })
                })
            }
        }
    }
    await clientMongo.close();
    setTimeout(async() => await checkTweets(clientDiscord),5000);
}