import { Injectable } from '@angular/core';
import { contentIndex, ContentMeta } from './content-index';
import { Tag, tags } from './tags';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  
  pageContentList: ContentMeta[] = contentIndex
  tagsSelected: Map<string, boolean> = new Map();

  pageSize = 10
  pageNum = 1
  
  constructor() {
    tags.forEach(tag => this.tagsSelected.set(tag.name, false));
  }

  selectTag(tag: Tag): void {
    this.tagsSelected.set(tag.name, true);
    this.pageContentList = this.pageContentList
      .filter(content => content.tags.some(tag => this.tagsSelected.get(tag) == true))
  }

  clearTagsFilter(): void {
    this.tagsSelected.forEach((value, key) => this.tagsSelected.set(key, false));
    this.pageContentList = contentIndex;
  }
  
  getPageContentList(pageNum: number, pageSize: number): ContentMeta[] {
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    return this.pageContentList.slice(start, end);
  }

}
