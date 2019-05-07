import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http'; 

@Injectable({
    providedIn: 'root',
})

export class DashboardService {

    constructor() { }

    filterImages(searchQuery) {
        return searchQuery
        // return this.httpClient.post('https://3o2tard9ia.execute-api.us-east-1.amazonaws.com/beta/v1/chatbot/', {
        //   "userQuery": userQuery
        // })
    }

}
