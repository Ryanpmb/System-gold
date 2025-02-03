import axios from "axios"
import ToBase64 from "../../components/toBase64/toBase64"
import { api } from "../api"
export const CreateUser = async (values) =>{
    try {
        const payload = {
            name: values.name,
            email: values.email,
            telefone: values.telefone,
            password: values.password
        }
        const response = await api.post('/CreateUser', payload)

        return response
    } catch (error) {
        console.error(error)
    }
}

export const GetUser = async (id) =>{
    try {
        
        const userData = await api.get(`/GetUser/${id}`)
        return userData.data

    } catch (error) {
        console.error(error)
    }
}

export const updateUserInformations = async ({addresses, Logo, id }) => {
      
    try {
        const response = await api.patch("/updateUserInformations", {
            Adress: JSON.stringify(addresses),
            Logo: Logo,
            id
        })

        return response
    } catch (error) {
        console.error(error.message || error.data)        
    }
}

export const getClubImage = async (id) =>{
    try {
        const response = await api.get(`/ClubImage/${id}`)
        return response
    } catch (error) {
        console.error(error)
        if(error.status === 404){
            return "sem img"
        }
    }
}