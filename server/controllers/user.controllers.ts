
import { createClient } from "redis";
import { CONFIG } from '../utils/config.utils';
import { RedisClientType } from "@redis/client";

// TODO: abstract Controller
export class UserController{
	client: RedisClientType = createClient({url:CONFIG.get("REDIS_URI")})
	publisher: RedisClientType = createClient({url:CONFIG.get("REDIS_URI")})
	users: User[] = []

	joinChat = async (req, res) => {
		console.log(req.body)
		let user: User = req.body
		if (user) {
			await this.client.connect()
			let cachedUsers = await this.client.get('users')
			if(cachedUsers){
				let cachedUsersParsed = JSON.parse(cachedUsers)
				for (const element of cachedUsersParsed){
					if(element.userId === user.userId){
						await this.client.quit()
						res.status(400).json({
							message: "User already existing.",
						});
						return
					}
				}
				console.log(this.users)
			}

			this.users.push(user)
			await this.publisher.publish('newUser',JSON.stringify(user))
			await this.client.set("users",JSON.stringify(this.users))
			await this.client.quit()
			res.status(200).json({
				message: "Chat joined",
				user: user,
			});
		} else {
			res.status(400).json({
				message: "Bad request",
			});
		}
	}; 

	getUsers = async (req, res) => {
		res.status(200).json({
			message: "User list",
			users: this.users,
		});
	}; 


	deleteUsers = async (req, res) => {
		await this.client.connect()
		let result = await this.client.del('users');
		console.log(result)
		await this.client.quit()
		
		this.users = []
		res.status(200).json({
			message: "User list",
			users: this.users,
		});
		
	}

	async initUsers(){
		await this.client.connect()
		let cacheResult = await this.client.get('users')
		if(cacheResult){
			let result = JSON.parse(cacheResult)
			this.users = result
			console.log(this.users)
		}else{
			console.log("ERROR: cacheResult=",cacheResult)
		}
		
		await this.client.quit()
	}

	async initUserPub(){
		try {
			await this.publisher.connect()
		} catch (error) {
			console.log("ERROR CONNECTING TO ",CONFIG.get("REDIS_URI"))
			console.log(error)
		}
	}
}
