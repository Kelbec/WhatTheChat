import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

export class MessageController{
	client = createClient({url:'redis://default:redispw@localhost:55001'})  //TODO: from env file
	publisher = createClient({url:'redis://default:redispw@localhost:55001'})  //TODO: from env file
	messages: Message[] = []

	constructor(){
		this.publisher.connect()
	}

	sendMessage = async (req, res) => {
		console.log(req.body)
		const message: Message = req.body;
		if (message) {
			await this.client.connect()
			let cachedUsers = await this.client.get('users')
			if(cachedUsers){
				let cachedUsersParsed = JSON.parse(cachedUsers)
				let foundUser = false
				for (let i=0; i<cachedUsersParsed.length; i++ ){
					console.log(cachedUsersParsed[i].userId)
					if(cachedUsersParsed[i].userId === message.userId){
						foundUser = true
					}
				}
				if(!foundUser){
					await this.client.quit()
					res.status(400).json({
						message: "User not existing.",
					});
					return
				}
			} else {
				await this.client.quit()
				res.status(400).json({
					message: "User not existing.",
				});
				return
			}
			this.messages.push(message)
			await this.publisher.publish('newMessage',JSON.stringify(message))
			await this.client.set("messages",JSON.stringify(this.messages))
			await this.client.quit()

			res.status(200).json({
				message: "Message sent",
				user: message,
			});
		} else {
			res.status(400).json({
				message: "Bad request",
			});
		}
	}; 

	deleteMessages = async (req, res) => {
		
		this.messages = []
		await this.client.connect()
		await this.client.del('messages');
		await this.client.quit()

		res.status(200).json({
			message: "Messages deleted",
		});
		
	}; 
	


	getMessages = async (req, res) => {
		
		res.status(200).json({
			message: "Messages",
			user: this.messages,
		});
	}; 

	async initMessages(){
		await this.client.connect()
		let cacheResult = await this.client.get('messages')
		
		if(cacheResult){
			let result = JSON.parse(cacheResult)
			this.messages = result
			console.log(this.messages)
		}else{
			console.log("ERROR: cacheResult=",cacheResult)
		}
		
		await this.client.quit()
	}
}
