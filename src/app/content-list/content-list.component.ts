import { Component, OnInit } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { PageService } from '../page.service';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.css']
})
export class ContentListComponent implements OnInit {

  constructor(
    public pageService: PageService
  ) {}

  // contentIndex: ContentMeta[] = this.pageService.indexBuffer;
  pageIndexList: string[] = this.pageService.pageIndexList;

  ngOnInit(): void {
  }

  jumpPage(page: string) {
    this.pageService.jumpPage(page);
  }

}
