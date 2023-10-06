import axios from "axios";
export class PhotosAPI{
    constructor(){
        this.pageSize = 40;
        this.page = 1;
        this.query = '';
        this.maxPage = 1;
    }

    async fetchPhotos(){
        const BASE_URL = "https://pixabay.com/api/";
        const PARAMS = new URLSearchParams({
            key: '39829735-722e175b01b967c16f6acbd5c',
            q: this.query,
            page: this.page,
            per_page: this.pageSize,
            safesearch: true,
            orientation: "horizontal",
            image_type: "photo",
            lang: "en",
            lang: "fi"      
        });

        const url = `${BASE_URL}?${PARAMS}`;
        
        const res = await axios(url);
        return res.data;
    }
}