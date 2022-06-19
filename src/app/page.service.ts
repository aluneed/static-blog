import { Injectable } from '@angular/core';
import { contentIndex, ContentMeta } from './content-index';
import { Tag, tags } from './tags';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  
  pageContentList: ContentMeta[] = contentIndex.reverse();
  tagsSelected: Map<string, boolean> = new Map();

  indexBuffer: ContentMeta[] = [];

  pageSize = 10;
  pageNum = 1;
  currentPage = 1;
  
  constructor() {
    tags.forEach(tag => this.tagsSelected.set(tag.name, false));
    this.setCurrentPage(1, 10);
  }

  selectTag(tag: Tag): void {
    this.tagsSelected.set(tag.name, true);
    this.updateContentList();
  }

  deselectTag(tag: Tag): void {
    this.tagsSelected.set(tag.name, false);
    this.updateContentList();
  }

  updateContentList(): void {
    this.pageContentList = this.pageContentList
      .filter(content => content.tags.some(tag => this.tagsSelected.get(tag) == true));
    this.setCurrentPage(this.pageNum, this.pageSize);
  }

  clearTagsFilter(): void {
    this.tagsSelected.forEach((value, key) => this.tagsSelected.set(key, false));
    this.pageContentList = contentIndex;
    this.setCurrentPage(this.pageNum, this.pageSize);
  }

  setCurrentPage(pageNum: number, pageSize: number): void {
    var pageResult = this.getPageContentList(pageNum, pageSize);
    for(var i = 0; i < pageResult.length; i++) {
        this.indexBuffer[i] = pageResult[i];
    }
    for(var i = pageResult.length; i < pageSize; i++) {
      this.indexBuffer.pop();
    }
  }
  
  getPageContentList(pageNum: number, pageSize: number): ContentMeta[] {
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    return this.pageContentList.slice(start, end);
  }

}
