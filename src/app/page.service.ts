import { Injectable } from '@angular/core';
import { contentIndex, ContentMeta } from './content-index';
import { Tag, tags } from './tags';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  
  contentList: ContentMeta[] = contentIndex.reverse();
  tagsSelected: Map<string, boolean> = new Map();
  filteredContentList: ContentMeta[] = this.contentList;

  indexBuffer: ContentMeta[] = [];
  pageIndexList: string[] = [];

  pageSize = 10;
  pageNum = 1;
  currentPage = 1;

  pageCount = 1;
  tagCount = 0;
  
  constructor() {
    this.pageCount = Math.ceil(this.contentList.length / this.pageSize);
    
    tags.forEach(tag => this.tagsSelected.set(tag.name, false));
    this.setCurrentPage(1);
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
  }

  setCurrentPage(pageNum: number): void {
    this.currentPage = pageNum;
    this.pageIndexList.splice(0, this.pageIndexList.length);  //pageIndexList的构建可以提前, 然后在这里取slice, 再根据情况在首位添加跳转符号
    let min = Math.max(pageNum - 5, 1);
    let max = Math.min(pageNum + 5, this.pageCount);
    if (pageNum > 1) {
      this.pageIndexList.push("<<");
      this.pageIndexList.push("<");
    }
    for (let i = min; i <= max; i++) {
      this.pageIndexList.push(i.toString());
    }
    if (pageNum < this.pageCount) {
      this.pageIndexList.push(">");
      this.pageIndexList.push(">>");
    }

    var pageResult = this.getPageContentList(pageNum, this.pageSize);
    for (var i = 0; i < pageResult.length; i++) {
      this.indexBuffer[i] = pageResult[i];
    }
    var length = this.indexBuffer.length;
    for (var i = pageResult.length; i < length; i++) {
      this.indexBuffer.pop();
    }
  }

  selectTag(tag: Tag): void {
    this.tagsSelected.set(tag.name, true);
    this.tagCount++;
    this.updateFilteredContentList();
  }

  deselectTag(tag: Tag): void {
    this.tagsSelected.set(tag.name, false);
    this.tagCount--;
    //去掉最后一个选项后需要做特殊处理
    if(this.tagCount == 0) {
      this.clearTagsFilter();
    } else {
      this.updateFilteredContentList();
    }
  }

  updateFilteredContentList(): void {
    this.filteredContentList = this.contentList
      .filter(content => content.tags.some(tag => this.tagsSelected.get(tag) == true));  //这里会产生一个新的数组; 数组内的对象引用是一样的?
    this.pageCount = Math.ceil(this.filteredContentList.length / this.pageSize);
    this.setCurrentPage(1);
  }

  clearTagsFilter(): void {
    this.tagsSelected.forEach((value, key) => this.tagsSelected.set(key, false));
    this.filteredContentList = this.contentList;
    this.pageCount = Math.ceil(this.filteredContentList.length / this.pageSize);
    this.setCurrentPage(1)
  }

  getPageContentList(pageNum: number, pageSize: number): ContentMeta[] {
    const start = (pageNum - 1) * pageSize;
    const end = Math.min(start + pageSize, this.filteredContentList.length);
    return this.filteredContentList.slice(start, end);
  }

}
