import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

@Injectable({
    providedIn: 'root',
})

export class DashboardService {

    constructor(private http: HttpClient) { }

    filterImages(searchQuery, token): any{

        if (searchQuery.toDate) {
            searchQuery.toDate = (new Date(searchQuery.toDate)).getTime() / 1000;

        }
        if (searchQuery.fromDate) {
            searchQuery.fromDate = (new Date(searchQuery.fromDate)).getTime() / 1000;
        }

        const headers = new HttpHeaders(
            {
                'Authorization': token,
            });

        return this.http.post(' https://1948nn5cp0.execute-api.us-east-1.amazonaws.com/dev/v1/search', searchQuery, {headers} )
    }

}
