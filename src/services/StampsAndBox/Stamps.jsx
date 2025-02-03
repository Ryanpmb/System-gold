import axios from "axios"

export const getStamps = async() =>{
    try {
        const response = await axios.get("http://localhost:3300/api/getStamps")
        return response.data
    } catch (error) {
        console.error(error)
    }
}