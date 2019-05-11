import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root',
})

export class InputBoxService {

  constructor(private http: HttpClient) { }

  tagImage(tagQuery,idToken) {
    
    const headers = new HttpHeaders(
      {
        'Authorization': idToken,
      });

    return this.http.post(' https://1948nn5cp0.execute-api.us-east-1.amazonaws.com/dev/v1/tag', tagQuery, { headers })
  }

}
