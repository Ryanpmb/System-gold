import axios from "axios"

export const fetchExempleImage = async () =>{
    try {
        const response = await axios.post("http://localhost:3300/api/getExemple", {
            qtd: 7 
        })


        return response.data
    } catch (error) {
        console.error(error)
    }
}