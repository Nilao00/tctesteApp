import axios from 'axios';
const url = axios.create({
    baseURL:'http://201.18.67.132:3000/v1/',
    headers:{
        'Content-type': 'application/json'
    }
})
export default  url;