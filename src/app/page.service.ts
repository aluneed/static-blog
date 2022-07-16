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

  pageCount = 1;
  
  constructor() {
    this.pageCount = Math.ceil(this.contentList.length / this.pageSize);
    
    // tags.forEach(tag => this.tagsSelected.set(tag.name, false));
    var tagsSelectedJsonString = sessionStorage.getItem("tagsSelected");
    console.log(tagsSelectedJsonString);
    if (tagsSelectedJsonString == null || tagsSelectedJsonString == "{}") {
      tags.forEach(tag => this.tagsSelected.set(tag.name, false));
      console.log("refresh" + " branch 1");
      console.log(this.tagsSelected);
      console.log(this.indexBuffer);
    } else {
      console.log(this.tagsSelected);
      tagsSelectedJsonString.split(",").forEach(tupleString => {
        var tuple: string[] = tupleString.split(":");
        this.tagsSelected.set(tuple[0], tuple[1] == "true");
      })
      console.log("refresh" + " branch 2");
      console.log(this.tagsSelected);
      console.log(this.indexBuffer);
    }
    this.updateFilteredContentList();
    var currentPage = sessionStorage.getItem("currentPage");
    this.setCurrentPage(currentPage == null ? 1 : Number(currentPage));

    window.onbeforeunload = () => {
      this.saveTagsSession();
      console.log("saved");
    }
  }

  jumpPage(page: String) {
    if (page == "<<") {
      this.setCurrentPage(1);
    } else if (page == "<") {
      this.setCurrentPage(this.getCurrentPage() - 1);
    } else if (page == ">") {
      this.setCurrentPage(this.getCurrentPage() + 1);
    } else if (page == ">>") {
      this.setCurrentPage(this.pageCount);
    } else {
      this.setCurrentPage(Number(page));
    }
  }

  getCurrentPage(): number {
    return Number(sessionStorage.getItem("currentPage"));
  }

  setCurrentPage(pageNum: number): void {
    sessionStorage.setItem("currentPage", pageNum.toString());
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
    this.updateFilteredContentList();
  }

  deselectTag(tag: Tag): void {
    this.tagsSelected.set(tag.name, false);
    
    //去掉最后一个选项后需要做特殊处理
    var tagCount = Array.from(this.tagsSelected.values()).filter(value => value).length;
    if(tagCount == 0) {
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
    this.setCurrentPage(1);
  }

  saveTagsSession(): void {
    var tagsSelectedString = Array.from(this.tagsSelected.entries())
      .reduce((accumulated, entry) => {
        return accumulated + entry[0] + ":" + entry[1] + ",";
      }, "");
    sessionStorage.setItem("tagsSelected", tagsSelectedString.substring(0, tagsSelectedString.length - 1));
  }

  getPageContentList(pageNum: number, pageSize: number): ContentMeta[] {
    const start = (pageNum - 1) * pageSize;
    const end = Math.min(start + pageSize, this.filteredContentList.length);
    return this.filteredContentList.slice(start, end);
  }

}
