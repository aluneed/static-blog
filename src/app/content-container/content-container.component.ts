import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageService } from '../page.service';
import { marked } from 'marked';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.css']
})
export class ContentContainerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private pageService: PageService
  ) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.path = routeParams.get('path');
    console.log(this.path);
    if(this.path != null) {
      this.http.get("assets/posts/" + this.path, {responseType: "text"})
        .subscribe(content => this.content = content)
    }
    this.title = this.pageService.indexBuffer.find(e => e.path == this.path)?.title!;
    this.fullPath = "assets/posts/" + this.path;

    // https://marked.js.org/using_advanced#options
    // Set options
    // `highlight` example uses https://highlightjs.org
    marked.setOptions({
      renderer: new marked.Renderer(),
      // highlight: function(code, lang) {
        // const hljs = require('highlight.js');
        // const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        // return hljs.highlight(code, { language }).value;
      // },
      // langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false,
      baseUrl: "assets/posts/"
    });
  }

  path:string | null = "";
  content: string = "# content not found";
  title: string= "title";
  fullPath: string = "";

}
