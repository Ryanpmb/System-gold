import axios from "axios";

export const getAllBoxs = async()=>{
    try {
        const response = await axios.get("http://localhost:3300/api/getBox");
        return response.data;

    } catch (error) {

        console.error(error);

    }
}