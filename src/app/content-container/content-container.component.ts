import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.css']
})
export class ContentContainerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.path = routeParams.get('path');
    console.log(this.path);
    if(this.path != null) {
      this.http.get("assets/posts/" + this.path, {responseType: "text"})
        .subscribe(content => this.content = content)
    }
  }

  path:string|null = "";
  content: string = "# content not found";

}
