import axios from "axios";
import ToBase64 from "../../components/toBase64/toBase64";
import { api } from "../api";

export const FindProduct = async (value)=>{
    try {

        const response = await api.post('/getProduct', { productName: value });

        return response.data
        
    } catch (error) {
        console.error(error);
        if(error.status === 404) {
            return [{message: "Nenhum produto encontrado"}]
        }
    }
}

export const registerNewProduct = async (values) =>{
    try {

        const response = await api.post('/registerNewProduct', values);
        return response.data

    } catch (error) {
        
        console.error(error)
        
    }
}

