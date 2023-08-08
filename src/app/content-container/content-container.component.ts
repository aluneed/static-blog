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

    // const renderer = new marked.Renderer();
    // renderer.image = function(src: string, tkitle: string, alt: string) {
    //   console.log('renderer calling', src, alt, title);
    //   return `<img src="${src}" alt="${alt}" tilte="${title} style="max-width: 100%;">`;
    // }

    // https://marked.js.org/using_advanced#options
    // Set options
    // `highlight` example uses https://highlightjs.org
    // marked.setOptions({
    //   renderer: renderer,
    //   pedantic: false,
    //   gfm: true,
    //   breaks: false,
    //   sanitize: false,
    //   smartLists: true,
    //   smartypants: false,
    //   xhtml: false,
    //   baseUrl: "assets/posts/"
    // });

    // const imageText = "![alt](images/test-images.jpg \"title\")";
    // console.log("original");
    // console.log(marked.parse(imageText));
    marked.use(
      {
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false,
        baseUrl: "assets/posts/",
        renderer: {  //no use
          image(src: string, title: string, alt: string) {
            console.log('renderer calling', src, alt, title);
            return `<img src="${src}" alt="${alt}" tilte="${title} style="max-width: 100%;">`;
          }
        }
      }
    )
    // console.log("changed")
    // console.log(marked.parse(imageText));  //conflicts when both 'baseUrl' and 'renderer image()' existing  
  }

  path:string | null = "";
  content: string = "loading";
  title: string= "title";
  fullPath: string = "";

}
