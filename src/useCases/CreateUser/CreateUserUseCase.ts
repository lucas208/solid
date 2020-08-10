import { IUsersRepository } from "../../repositories/IUserRepository";
import { ICreateUserRequestGTO } from "./CreateUserDTO";
import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";

export class CreateUserUseCase {

    constructor(
       private usersRepository: IUsersRepository,
       private mailProvider: IMailProvider 
   ) {}
   
    async execute(data: ICreateUserRequestGTO) { 
        const userAlreadyExists = await this.usersRepository.findByEmail(data.email)

        if(userAlreadyExists) {
            throw new Error('User already exists.')
        }

        const user = new User(data)

        await this.usersRepository.save(user)

        await this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email,
            },
            from: {
                name: 'Equipe do Biome',
                email: 'biome@ufrn.edu.br',
            }, 
            subject: 'Seja bem vindo à plataforma',
            body: '<p>Você já pode fazer login em nossa plataforma</p>'
        })
    }
}