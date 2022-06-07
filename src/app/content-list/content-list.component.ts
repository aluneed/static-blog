import { Component, OnInit } from '@angular/core';
import { contentIndex, ContentMeta } from '../content-index';
import { MatRippleModule } from '@angular/material/core';
import { PageService } from '../page.service';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.css']
})
export class ContentListComponent implements OnInit {

  constructor(
    private pageService: PageService
  ) {}

  contentIndex: ContentMeta[] = contentIndex;

  pageIndexList: string[] = [];

  currentPage: number = 1;
  itemCount = 0;
  pageCount = 1;

  ngOnInit(): void {
    this.itemCount = this.contentIndex.length;
    this.pageCount = Math.ceil(this.itemCount / 10);
    this.setCurrentPage(1);
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
    this.pageIndexList = [];
    let min = Math.max(page - 5, 1);
    let max = Math.min(page + 5, this.pageCount);
    if (page > 1) {
      this.pageIndexList.push("<<");
      this.pageIndexList.push("<");
    }
    for (let i = min; i <= max; i++) {
      this.pageIndexList.push(i.toString());
    }
    if (page < this.pageCount) {
      this.pageIndexList.push(">");
      this.pageIndexList.push(">>");
    }
    this.contentIndex = this.pageService.getPageContentList(this.currentPage, 10);
  }

  jumpPage(page: String) {
    if (page == "<<") {
      this.setCurrentPage(1);
    } else if (page == "<") {
      this.setCurrentPage(this.currentPage - 1);
    } else if (page == ">") {
      this.setCurrentPage(this.currentPage + 1);
    } else if (page == ">>") {
      this.setCurrentPage(this.pageCount);
    } else {
      this.setCurrentPage(Number(page));
    }
    this.contentIndex = this.pageService.getPageContentList(this.currentPage, 10);
  }

}
